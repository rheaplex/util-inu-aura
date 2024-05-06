'use client';

import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { injected } from '@wagmi/connectors';

export default function ConnectionManager() {
  const account = useAccount();
  const { connect, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
      <div className="content">
      <div>{error?.message}</div>
      {account.status === 'connected' ? (
          <button className="button" type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
    ) : (
        <button className="button"
      onClick={() => connect({ connector: injected()})}>
        Connect
      </button>
    )}
    </div>
  );
}
