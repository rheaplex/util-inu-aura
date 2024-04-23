'use client';

import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Aura() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
      <section className="section">
      <div className="container">
      <div style={{width: '12em'}}>
      Mint Aura.<br/>
      <Link href="/">🡄</Link>
      </div>
      </div>
      </section>
  );
}
