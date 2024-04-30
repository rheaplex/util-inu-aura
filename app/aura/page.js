'use client';

import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  useBlockNumber,
  useChainId,
  useReadContract
} from 'wagmi';
import { ContractFunctionExecutionError } from 'viem';
import { auraAddress, auraAbi } from '../generated';

export default function Aura() {
  const chainId = useChainId();
  const searchParams = useSearchParams();
  const address = searchParams.get('address');

  const { data: aura, error, queryKey } = useReadContract({
    abi: auraAbi,
    address: auraAddress[chainId],
    functionName: 'auraOf',
    args:[address],
  });

  const revertError = error?.walk(err => err instanceof ContractFunctionExecutionError);

  console.log([address, aura, error, revertError]);

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber]);

  return (
      <section className="section">
      <div className="container">
      {address || '—'}<br />
      {aura?.toString() || "?"}<br />
      {revertError?.toString() || error?.toString() || ''}
      </div>
      </section>
  );
}
