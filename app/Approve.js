'use client';

import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

import { utilAddress, inuAddress, utilAbi } from './generated';

export default function Approve() {
  const chainId = useChainId();
  const { account } = useAccount();
  const { data: hash, error: error, isPending: isPending, writeContract: writeContract } = useWriteContract();

  function handleMint (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    e.target.elements["amount"].value = "";
    writeContract({
      abi: utilAbi,
      address: utilAddress[chainId],
      functionName: 'approve',
        args: [inuAddress[chainId], BigInt(amount)],
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
      <input name="amount" className="input" type="text" placeholder={`UTIL allowance for INU`} disabled={isPending} />
      </div>
      <div className="control">
      <button className={`button button-mint is-info ${isPending && "is-loading"}`} type="submit">Approve UTIL For INU</button>
      </div>
      </div>
      </form>
      {error && (
          <div>Error: {error.shortMessage || error.message}</div>
      )}
    </div>
  );
}
