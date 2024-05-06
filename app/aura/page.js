'use client';

import './page.scss';

import { useSearchParams } from 'next/navigation'
import Image from 'next/image';
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
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [imgurl, setImgurl] = useState(undefined);
  const address = searchParams.get('address');
  const id = searchParams.get('id');

  const { data: aura, error, queryKey } = useReadContract({
    abi: auraAbi,
    address: auraAddress[chainId],
    functionName: 'auraOf',
    args:[address, id],
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey, searchParams]);

  const { data: tokenUri, error2 } = useReadContract({
    abi: erc721Abi,
    address: address,
    functionName: 'tokenURI',
    args:[id],
  });

  const revertError =
        (error || error2)?.walk(
          err => err instanceof ContractFunctionExecutionError
        );

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
    if (imgurl) {
      if (aura) {
        document.getElementById("aura").classList.add('img-aura');
      } else {
        document.getElementById("aura").classList.remove('img-aura');
      }
    }
  }, [aura, imgurl]);

  return (
      <div className="columns is-gapless fullheight is-centered is-vcentered">
      {/*{address || '—'}<br />
         {aura?.toString() || "?"}<br />*/}
    {imgurl
     ? <Image
     width={0}
     height={0}
     id="aura"
     className="token-image"
     src={imgurl}
     alt="The token image."
     />
     : <div className="field">
     <div className="control is-loading is-large">
     </div>
     </div>}
    {/*<audio id="aura-sound" controls loop={true} autoPlay={true}>
      <source src="aura.flac" type="audio/flac"></source>
      </audio>*/}
      { revertError?.toString() || error?.toString() || ""}
      </div>
  );
}
