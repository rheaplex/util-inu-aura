'use client';

import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
      <section className="section">
      <div className="container">
      <h1 className="title is-1">UTIL / INU / AURA</h1>
      <h2 className="subtitle is-3 mb-4">What would you like to do?</h2>
      <div style={{width: '12em'}}>
      <Link className="button is-fullwidth mb-4 is-link" href="/see">See a token's aura</Link>
      <Link className="button is-fullwidth mb-4 is-success" href="/util">Mint UTIL</Link>
      <Link className="button is-fullwidth mb-4 is-danger" href="/inu">Burn UTILs for INU</Link>
      <Link className="button is-fullwidth mb-4 is-info" href="/aura">Mint AURA</Link>
</div>
</div>
</section>
  );
}
