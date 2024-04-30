'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  useAccount,
  useBlockNumber,
  useChainId,
  useReadContracts
} from 'wagmi';
import { injected } from '@wagmi/connectors';
import { erc20Abi } from 'viem' ;

import { utilAddress, inuAddress, inuAbi, auraAddress } from './generated';

const ADDRESSES = {
  "UTIL": utilAddress[31337],
  "INU": inuAddress[31337],
  "AURA": auraAddress[31337]
};

export default function Balances({ symbols }) {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  symbols = JSON.parse(symbols);
  const contracts = symbols.map(symbol => {
    return ({
      address: ADDRESSES[symbol],
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address]
    });
  });
  // Always call this, even if it will fail, to obey the Rule of Callbacks.
  const {
    data: balances,
    error,
    isPending,
    queryKey
  } = useReadContracts({
    allowFailure: false,
    contracts: contracts
  });

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber]);

  if (! isConnected) {
    return (<p>Connect to see account balances</p>);
  }

  if (isPending) {
    return (<div> Loading...</div>);
  }

  if (error) {
    return (
        <div>
        Error: {error.shortMessage || error.message}
      </div>
    );
  }

  return (
    <div className="content">
      <table className="table">
      <tbody>
      {symbols.map((symbol, i) => {
        return (
            <tr key={i}>
            <td>{symbol}</td>
            <td>{balances[i].toString()}</td>
            </tr>
        );
      })}
    </tbody>
      </table>
      </div>
  );
}
