'use client';

import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

import { utilAddress, auraAddress, utilAbi, auraAbi } from './generated';

const ADDRESSES = {
  "UTIL": utilAddress[31337],
  "AURA": auraAddress[31337]
};

const ABIS = {
  "UTIL": utilAbi,
  "AURA": auraAbi
};

export default function Mint({symbol}) {
  const account = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function handleMint (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    e.target.elements["amount"].value = "";
    writeContract({
      abi: ABIS[symbol],
      address: ADDRESSES[symbol],
      functionName: 'mint',
      args: [account.address, BigInt(amount)],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
          hash,
        });

  return (
      <div className="content">
      <form onSubmit={handleMint}>
      <div className="field has-addons">
      <div className="control">
      <input name="amount" className="input" type="text" placeholder={`Amount of ${symbol} to mint`} disabled={isPending} />
      </div>
      <div className="control">
      <button className={`button button-mint is-info ${isPending && "is-loading"}`} type="submit">Mint {symbol}</button>
      </div>
      </div>
      </form>
      {error && (
          <div>Error: {error.shortMessage || error.message}</div>
      )}
    </div>
  );
}
