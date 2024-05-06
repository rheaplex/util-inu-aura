'use client';

export default function CheckAura() {

  function onClick (e) {
    e.preventDefault();
    const address = e.target.elements["address"].value;
    const id = e.target.elements["id"].value;
    const newWindow = window.open(
      `./aura/?address=${address}&id=${id}`,
      '_blank',
      'noopener,noreferrer'
    );
    if (newWindow) {
      newWindow.opener = null;
    }
  }

  return (
      <div className="content">
      <form className="" onSubmit={onClick}>
      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">NFT contract address</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input name="address"
    className="input"
    type="text"
    placeholder="0x0123456789abcde0123456789abcdef01234567"
    pattern="0x[0-9a-fA-F]{40}"
    required={true}
      />
      <p className="help">Enter a valid Ethereum address</p>
      </div>
      </div>
      </div>
      </div>

      <div className="field is-horizontal">
      <div className="field-label is-normal">
      <label className="label">Token ID number</label>
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <input name="id"
    className="input"
    type="number"
    placeholder="1"
    pattern="\d*"
    required={true}
      />
      <p className="help">Enter a valid ERC-721 token ID number</p>
      </div>
      </div>
      </div>
      </div>

      <div className="field is-horizontal">
      <div className="field-label">
      {/* Left empty for spacing */}
      </div>
      <div className="field-body">
      <div className="field">
      <div className="control">
      <button className="button is-primary" >
      View
    </button>
      </div>
      </div>
      </div>
      </div>

      </form>
      </div>
  );

}
