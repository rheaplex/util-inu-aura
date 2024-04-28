'use client';

import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

import { utilAddress, inuAddress, utilAbi, inuAbi } from './generated';

export default function BurnAndMint({symbol}) {
  const { address } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  async function handleMint (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    e.target.elements["amount"].value = "";
    writeContract({
      abi: utilAbi,
      address: utilAddress[31337],
      functionName: 'approve',
      args: [inuAddress, BigInt(amount)],
    });
    writeContract({
      abi: inuAbi,
      address: inuAddress[31337],
      functionName: 'burnUtilForInu',
      args: [address, BigInt(amount)],
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
      <input name="amount" className="input" type="text" placeholder={`Amount of UTIL to burn in exchange for INU`} disabled={isPending} />
      </div>
      <div className="control">
      <button className={`button button-mint is-info ${isPending && "is-loading"}`} type="submit">Mint INU</button>
      </div>
      </div>
      </form>
      {error && (
          <div>Error: {error.shortMessage || error.message}</div>
      )}
    </div>
  );
}
