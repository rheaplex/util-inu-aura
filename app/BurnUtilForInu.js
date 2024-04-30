'use client';

import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';
import { ContractFunctionRevertedError } from 'viem';

import { inuAddress, inuAbi } from './generated';

export default function BurnUtilForInu() {
  const chainId = useChainId();
  const { account } = useAccount();
  const { data: hash, error: error, isPending: isPending, writeContract: writeContract } = useWriteContract();

  function handleMint (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    e.target.elements["amount"].value = "";
    writeContract({
      abi: inuAbi,
      address: inuAddress[31337],
      functionName: 'burnUtilForInu',
      args: [BigInt(amount)],
    });
  }
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
          hash,
        });

  const revertError = error?.walk(err => err instanceof ContractFunctionRevertedError).data?.errorName;

  const err = revertError || error;

  return (
      <div className="content">
      <form onSubmit={handleMint}>
      <div className="field has-addons">
      <div className="control">
      <input name="amount" className="input" type="text" placeholder={`Amount of UTIL to burn in exchange for INU`} disabled={isPending} />
      </div>
      <div className="control">
      <button className={`button button-mint is-info ${isPending && "is-loading"}`} type="submit">Burn Util For INU</button>
      </div>
      </div>
      </form>
      {err && (
          <div>Error: {revertError || error.shortMessage || error.message}</div>
      )}
    </div>
  );
}
