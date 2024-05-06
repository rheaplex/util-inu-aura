'use client';

import {
  useChainId,
  useWriteContract
} from 'wagmi';

import { utilAddress, inuAddress, utilAbi } from './generated';

export default function Approve() {
  const chainId = useChainId();
  const {
    error: error,
    isPending: isPending,
    writeContract: writeContract
  } = useWriteContract();

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

  return (
      <div className="content">
      <form onSubmit={handleMint}>
      <div className="field has-addons">
      <div className="control">
      <input name="amount"
    className="input"
    type="number"
    placeholder={1}
    disabled={isPending}
    pattern="\d*"
    required={true}
      />
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
