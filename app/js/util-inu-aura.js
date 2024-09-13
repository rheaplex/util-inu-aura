import {
  createPublicClient,
  custom,
  erc20Abi,
  erc721Abi,
} from 'viem';
import { mainnet } from 'viem/chains';

import {
  utilAddress, inuAddress, auraAddress,
  utilAbi, inuAbi, auraAbi
} from './generated';

////////////////////////////////////////////////////////////////////////
// Contract details.
////////////////////////////////////////////////////////////////////////

const ADDRESSES = {
  "UTIL": utilAddress,
  "INU": inuAddress,
  "AURA": auraAddress
};

const ABIS = {
  "UTIL": utilAbi,
  "INU": inuAbi,
  "AURA": auraAbi
};

////////////////////////////////////////////////////////////////////////
// State.
////////////////////////////////////////////////////////////////////////

let tokenAddress;
let tokenId;
let metadata;
let imgUrl;
let aura;
let unwatchAuraCallback;

const client = createPublicClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

////////////////////////////////////////////////////////////////////////
// Http/ipfs network access.
////////////////////////////////////////////////////////////////////////

async function fetchMetadata () {
  const tokenUri = await client.useReadContract({
    abi: erc721Abi,
    address: tokenAddress,
    functionName: 'tokenURI',
    args:[ tokenId ],
  });
  if (! tokenUri) {
    metadata = null;
    imgUrl = null;
    return;
  }
  const response = await fetch(
    // :-/
    tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/'),
    { redirect: 'follow' }
  );
  metadata = await response.json();
  // :-/
  imgUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
}

////////////////////////////////////////////////////////////////////////
// Blockchain interaction.
////////////////////////////////////////////////////////////////////////

async function readBalances (symbols) {
  const chainId = await client.getChainId();
  const address = client.requestAddresses()[0];
  const contracts = symbols.map(symbol => {
    return ({
      address: ADDRESSES[symbol][chainId],
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [ address ]
    });
  });
  const results = await client.multiCall({ contracts });
  let i = 0;
  return results.map(result => ({
    symbol: symbols[i++],
    value: result.status == "success" ? result.result : "error"
  }));
}

async function readAura () {
  const chainId = client.chainId();
  aura = await client.readContract({
    abi: auraAbi,
    address: auraAddress[chainId],
    functionName: 'auraOf',
    args:[ tokenAddress, tokenId ],
  });
}

async function unwatchAura () {
  if (unwatchAuraCallback) {
    await unwatchAura();
    unwatchAuraCallback = null;
  }
}

export async function watchAura () {
  unwatchAura();
  unwatchAuraCallback = client.watchContractEvent({
    address: auraAddress,
    abi: auraAbi,
    eventName: "Transfer",
    // FIXME:
    //args: { from: tokenAddress },
    onLogs: readAura
  });
}

async function writeMint (symbol,address, amount) {
  const chainId = client.chainId();
  return client.writeContract({
    abi: ABIS[symbol],
    address: ADDRESSES[symbol][chainId],
    functionName: 'mint',
    args: [ address, BigInt(amount) ],
  });
}

async function writeApproveUtils (amount) {
  const chainId = client.chainId();
  return client.writeContract({
    abi: utilAbi,
    address: utilAddress[chainId],
    functionName: 'approve',
    args: [inuAddress[chainId], BigInt(amount)],
  });
}

async function writeBurnUtilForInu (amount) {
  const chainId = client.chainId();
  return client.writeContract({
    abi: inuAbi,
    address: inuAddress[chainId],
    functionName: 'burnUtilForInu',
    args: [BigInt(amount)],
  });
}

////////////////////////////////////////////////////////////////////////
// Gui manipulation.
////////////////////////////////////////////////////////////////////////

function setGuiAura () {
  if (imgUrl && aura) {
    document.getElementById("aura").classList.add('img-aura');
  } else {
    document.getElementById("aura").classList.remove('img-aura');
  }
}

async function leaveAuraDisplay () {
  document.getElementById("aura").src = undefined;
  document.getElementById("aura").classList.remove('img-aura');
  tokenAddress = null;
  tokenId = null;
  metadata = null;
  imgUrl = null;
  aura = null;
  return unwatchAura();
}

////////////////////////////////////////////////////////////////////////
// Gui Event Handlers.
////////////////////////////////////////////////////////////////////////

export async function handleCheckAura (e) {
  const formData = new FormData(e.target);
  tokenAddress = formData.get('address');
  tokenId = formData.get('id');
  await fetchMetadata();
  await readAura();
  setGuiAura();
  return watchAura();
}

async function handleMint (symbol, e) {
  e.preventDefault();
  const address = client.requestAddresses()[0];
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeMint(symbol, address, amount);
}

export async function handleMintUtils (e) {
  return handleMint("UTIL", e);
}

export async function handleMintAura (e) {
  return handleMint("AURA", e);
}

export function handleApproveUtils (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeApproveUtils(amount);
}

export async function handleBurnUtilForInu (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeBurnUtilForInu(amount);
}
