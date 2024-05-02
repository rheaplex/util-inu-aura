'use client';

import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

import { utilAddress, auraAddress, utilAbi, auraAbi } from './generated';

const ADDRESSES = {
  "UTIL": utilAddress,
  "AURA": auraAddress
};

const ABIS = {
  "UTIL": utilAbi,
  "AURA": auraAbi
};

export default function Mint({symbol}) {
  const chainId = useChainId();
  const account = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function handleMint (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    e.target.elements["amount"].value = "";
    writeContract({
      abi: ABIS[symbol],
      address: ADDRESSES[symbol][chainId],
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
      <input name="amount" className="input input-mint" type="text" placeholder={`Amount`} disabled={isPending} />
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
