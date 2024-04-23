'use client';

import { Link } from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function See() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
      <section className="section">
woooooooooooo
</section>
  );
}
