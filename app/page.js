'use client';

import { useAccount } from 'wagmi';

import ConnectionManager from './ConnectionManager';
import Balances from './Balances';
import Mint from './Mint';
import BurnAndMint from './BurnAndMint';

export default function App() {
  const { address } = useAccount();
  return (
      <div className="container">
      <div className="title">UTIL/INU/AURA</div>
      <div className="content">
      <div className="subtitle">Balances of {address}</div>
      <Balances symbols='["UTIL", "INU", "AURA"]' />
      </div>
      <div className="content">
      <div className="subtitle">Mint to {address}</div>
      <Mint symbol="UTIL" />
      <Mint symbol="AURA" />
      <BurnAndMint />
      </div>
      <ConnectionManager />
      </div>
  );

}
