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
    const id = e.target.elements["id"].value;
    const newWindow = window.open(
      `./aura/?address=${address}&id=${id}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  return (
      <div className="content">
      <form className="" onSubmit={onClick}>

      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">NFT contract address</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input name="address" className="input" type="text" placeholder="0x0123456789abcdef0123" />
      </div>
      </div>
      </div>
      </div>

      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">Token ID number</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input name="id" className="input" type="text" placeholder="1" />
      </div>
      </div>
      </div>
      </div>

      <div className="field is-horizontal">
      <div className="field-label">
      {/* Left empty for spacing */}
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <button className="button is-primary" >
      View
    </button>
      </div>
      </div>
      </div>
      </div>

      </form>
      </div>
  );

}
