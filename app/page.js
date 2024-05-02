'use client';

import { useAccount } from 'wagmi';

import ConnectionManager from './ConnectionManager';
import Balances from './Balances';
import Mint from './Mint';
import Approve from './Approve';
import BurnUtilForInu from './BurnUtilForInu';
import CheckAura from './CheckAura';

export default function App() {
  const { address } = useAccount();
  return (
    <section className="section">
      <div className="container">
      <div className="title">UTIL/INU/AURA</div>
      <div className="box">
      <div className="subtitle content">Address</div>
      <div className="is-family-monospace has-text-weight-semibold content">
      {address || "—"}
    </div>
      <ConnectionManager />
      </div>
      <div className="box">
      <div className="subtitle">Balances of {address || "—"}</div>
      <Balances symbols='["UTIL", "INU", "AURA"]' />
      </div>
      <div className="box">
      <div className="subtitle">Mint to {address || "—"}</div>
      {address
       ? <div>
       <Mint symbol="UTIL" />
       <Mint symbol="AURA" />
       <Approve />
       <BurnUtilForInu />
       </div>
    : <p>Connect account to mint to above</p>}
      </div>
      <div className="box">
      <div className="subtitle">View Token Aura</div>
      <CheckAura />
      </div>
      </div>
      </section>
  );

}
