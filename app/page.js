'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main>
    </main>
  );
}

export default App;
