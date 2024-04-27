'use client';

import Link from 'next/link';
import { useAccount, useReadContracts, useWriteContrac } from 'wagmi';
const utilContract = {};
const inuContract = {};

function handleBurnMint () {
  console.log("Add UTIL allowance for INU contract.");
  console.log("Burn UTIL to mint INU.");
}

export default function Inu() {
  const account = useAccount();
  const address = account.address?.toString();

  const { utilBalance, inuBalance } = useReadContracts({
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
      }
    ]});


  return (
      <section className="section">
      <div className="container">

      <h1 className="title is-h1">Current balance of {address}</h1>
      <h2 className="subtitle is-h2">{utilBalance?.toString()} UTIL</h2>
      <h2 className="subtitle is-h2">{inuBalance?.toString()} INU</h2>

      <h1 className="title is-h1">Burn UTIL to mint INU to {address}</h1>

      <div class="field is-horizontal">
      <div class="field-label is-normal">
      <label class="label">Amount of UTIL to burn in exchange for INU</label>
      </div>
      <div class="field-body">
      <div class="field">
      <div class="control">
      <input class="input" type="text" placeholder="1"></input>
      </div>
      <p class="help is-danger">You will have to sign an allowance transaction for this many UTIL, then sign a second transaction to mint INU</p>
      </div>
      </div>
      </div>

      <div class="field is-horizontal">
      <div class="field-label">
      {/* Left empty for spacing */}
      </div>
      <div class="field-body">
      <div class="field">
      <div class="control">
      <button class="button is-primary" onClick={handleBurnMint}>Burn</button>
      </div>
      </div>
      </div>

      <Link href="/">🡄</Link>
      </div>
      </div>
      </section>
  );
}
