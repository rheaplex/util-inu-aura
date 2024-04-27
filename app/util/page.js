'use client';

import Link from 'next/link';
import { FaArrowAltCircleLeft } from "react-icons/fa";

import {
  isPending,
  useAccount,
  useReadContract,
  useWriteContract
} from 'wagmi';
import { utilAbi } from '../generated';

function handleMint (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  useWriteContract({
    abi: utilAbi,
    functionName: 'mint',
    args: [BigInt(amount)],
  });
}

export default function Page() {
  const account = useAccount();
  const address = account.address?.toString();
    const { utilBalance } = useReadContract({
    ...Util,
    functionName: 'balanceOf',
    args: [address],
  });

  return (
      <section className="section">

      <div className="container">
      <div className="content">
      <h1 className="title">UTIL</h1>
      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">Balance of {address}</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input className="input is-static" type="text" value={utilBalance?.toString()} readOnly />
    </div>
      </div>
      </div>
      </div>
      </div>

    <div className="content">
      <h4 className="is-h4">Mint UTIL to {address}</h4>

      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">Amount</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input className="input" type="text" placeholder="1" />
      </div>
      </div>
      </div>
      </div>

      <div className="field is-horizontal">
      <div className="field-label">
      {/*Left empty for spacing */}
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <button className="button is-primary" onClick={handleMint}>Mint</button>
      </div>
      </div>
      </div>
      </div>

    </div>

      <div className="mt-4">
      <Link href="/"><span className="icon">
      <FaArrowAltCircleLeft />
      </span></Link>

      </div>
      </div>
      
      </section>
  );
}
