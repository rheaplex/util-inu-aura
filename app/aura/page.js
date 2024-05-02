'use client';

import './page.scss';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  useBlockNumber,
  useChainId,
  useReadContract
} from 'wagmi';
import { ContractFunctionExecutionError, erc721Abi } from 'viem';
import { auraAddress, auraAbi } from '../generated';

export default function Aura() {
  const chainId = useChainId();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const address = searchParams.get('address');
  const id = searchParams.get('id');
  const [imgurl, setImgurl] = useState(undefined);

  const { data: aura, error, queryKey } = useReadContract({
    abi: auraAbi,
    address: auraAddress[chainId],
    functionName: 'auraOf',
    args:[address, id],
  });

  const revertError = error?.walk(err => err instanceof ContractFunctionExecutionError);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  const { data: tokenUri, error2 } = useReadContract({
    abi: erc721Abi,
    address: address,
    functionName: 'tokenURI',
    args:[id],
  });

  useEffect(() => {
    async function fetchMetadata() {
      if (! tokenUri) {
        return;
      }
      const response = await fetch(
      // :-/
        tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/'),
        { redirect: 'follow' }
      );
      const json = await response.json();
      // :-/
      const url = json.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      setImgurl(url);
    }
    fetchMetadata();
  }, [tokenUri]);

  useEffect(() => {
    if (aura) {
      document.getElementById("aura").classList.add('img-aura');
    } else {
      document.getElementById("aura").classList.remove('img-aura');
    }
  }, [aura]);

  return (
      <div className="columns is-gapless fullheight is-centered is-vcentered">
      {/*{address || '—'}<br />
         {aura?.toString() || "?"}<br />*/}
      <img
    id="aura"
    className="token-image"
    src={imgurl}
    alt="The token image."
      />
    {/*<audio id="aura-sound" controls loop={true} autoPlay={true}>
      <source src="aura.flac" type="audio/flac"></source>
      </audio>*/}
      {/* revertError?.toString() || error?.toString() || '' */}
      </div>
  );
}
