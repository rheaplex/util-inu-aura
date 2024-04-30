'use client';

import { useRouter } from "next/router";
import { useAccount, useReadContract, serialize } from 'wagmi';
import { ContractFunctionRevertedError, erc20Abi } from 'viem' ;
import { auraAddress, auraAbi } from './generated';

export default function CheckAura() {

  function onClick (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const address = e.target.elements["address"].value;
    const newWindow = window.open(
      `./aura/?address=${address}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  return (
      <div className="content">
      <form onSubmit={onClick}>
      <div className="field has-addons">
      <div className="control">
      <input name="address" className="input" type="text" placeholder="Address to check" />
      </div>
      <div className="control">
      <button className="button button-mint is-info" type="submit">Check Aura</button>
      </div>
      </div>
      </form>
      </div>
  );

}
