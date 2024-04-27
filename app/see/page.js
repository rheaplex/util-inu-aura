'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  function handleSee (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const address = formData.get('address');
    const id = formData.get('id');
    //FIXME: VALIDATE
    router.push(`see/${address}/${id}`);
  }

  return (
      <section className="section">
      <div className="container">

      <h1 className="title is-h1">View ERC721 Aura</h1>

      <form onSubmit={handleSee}>
      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">Contract Address</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input name="address" className="input" type="text" placeholder="0x0abcdef0123456789">
      </input>
      </div>
      <p className="help">This contract address for the token</p>
      </div>
      </div>
      </div>

      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">Token ID</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input name="id" className="input" type="text" placeholder="1"></input>
      </div>
      <p className="help">The tokenId for the token</p>
      </div>
      </div>
      </div>

      <div className="field is-horizontal">
      <div className="field-label">
      {/*Left empty for spacing */}
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <button className="button is-primary">
      See aura
      </button>
      </div>
      </div>
      </div>
      </div>
      </form>

      <div className="mt-4">
      <Link href="/">🡄</Link>
      </div>
      </div>
      </section>
  );
}
