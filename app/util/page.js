'use client';

import { useAccount } from 'wagmi';

import ConnectionManager from '../ConnectionManager';
import Balances from '../Balances';
import Mint from '../Mint';

export default function App() {
  const { address } = useAccount();
  return (
      <div className="container">
      <div className="title">UTIL/INU/AURA</div>
      <div className="title">UTIL</div>
      <div className="content">
      <div className="subtitle">Balance of {address}</div>
      <Balances symbols='["UTIL"]' />
      </div>
      <div className="content">
      <div className="subtitle">Mint UTIL to {address}</div>
      <Mint symbol="UTIL" />
      </div>
      <ConnectionManager />
      </div>
  );

}
