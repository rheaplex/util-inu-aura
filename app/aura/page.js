'use client';

import Link from 'next/link';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
const utilContract = {};
const inuContract = {};
const auraContract = {};

function handleMint () {
  console.log("Mint AURA.");
}

export default function Aura() {
  const account = useAccount();
  const address = account.address?.toString();

  const { utilBalance, inuBalance, auraBalance } = useReadContracts({
    contracts: [
      {
        ...utilContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...inuContract,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        ...auraContract,
        functionName: 'balanceOf',
        args: [address],
      }
    ]});

  return (
      <section className="section">
      <div className="container">

      <h1 className="title is-h1">Current balance of {address}</h1>
      <h2 className="subtitle is-h2">{utilBalance?.toString()} UTIL</h2>
      <h2 className="subtitle is-h2">{inuBalance?.toString()} INU</h2>
      <h2 className="subtitle is-h2">{auraBalance?.toString()} AURA</h2>

      <h1 className="title is-h1">Mint AURA to {address}</h1>

      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">Amount</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input className="input is-danger" type="text" placeholder="1"></input>
      </div>
      <p className="help is-danger">This field is required</p>
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
      <button className="button is-primary" onClick={handleMint}>Mint</button>
      </div>
      </div>
      </div>
      </div>

      <Link href="/">🡄</Link>
      </div>
      </section>
  );
}
