import {
  http,
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  erc721Abi,
  getContract
} from 'https://esm.sh/viem';
import { anvil, mainnet } from 'https://esm.sh/viem/chains';

import {
  utilAddress, inuAddress, auraAddress,
  utilAbi, inuAbi, auraAbi
} from './generated.js';

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

let walletClient;
let publicClient;
let walletAddress;
let tokenAddress;
let tokenId;
let metadata;
let imgUrl;
let aura;
let unwatchAuraCallback;
let balanceIntervalId;

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

async function readBalance (symbol) {
  const chainId = await publicClient.getChainId();
  return publicClient.readContract({
    abi: erc20Abi,
    address: ADDRESSES[symbol][chainId],
    functionName: "balanceOf",
    args: [ walletAddress ]
  });
}

async function readAura () {
  const chainId = await publicClient.getChainId();
  aura = await publicClient.readContract({
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

async function watchAura () {
  unwatchAura();
  const chainId = await publicClient.getChainId();
  unwatchAuraCallback = publicClient.watchContractEvent({
    address: auraAddress[chainId],
    abi: auraAbi,
    eventName: "Transfer",
    // FIXME:
    //args: { from: tokenAddress },
    onLogs: readAura
  });
}

async function writeMint (symbol, amount) {
  const chainId = await walletClient.getChainId();
  return walletClient.writeContract({
    abi: ABIS[symbol],
    address: ADDRESSES[symbol][chainId],
    functionName: 'mint',
    args: [ walletAddress, BigInt(amount) ],
    account: walletAddress
  });
}

async function writeApproveUtils (amount) {
  const chainId = await walletClient.getChainId();
  return walletClient.writeContract({
    abi: utilAbi,
    address: utilAddress[chainId],
    functionName: 'approve',
    args: [inuAddress[chainId], BigInt(amount)],
    account: walletAddress
  });
}

async function writeBurnUtilForInu (amount) {
  const chainId = await walletClient.getChainId();
  return walletClient.writeContract({
    abi: inuAbi,
    address: inuAddress[chainId],
    functionName: 'burnUtilForInu',
    args: [BigInt(amount)],
    account: walletAddress
  });
}

////////////////////////////////////////////////////////////////////////
// Gui manipulation.
////////////////////////////////////////////////////////////////////////

function setWalletAddress (address) {
  walletAddress = address || false;
  [...document.getElementsByClassName("wallet-address")]
    .forEach(element => element.innerHTML = walletAddress || "—");
}

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

function show (element) {
  document.getElementById(element).hidden = false;
}

function hide (element) {
  document.getElementById(element).hidden = true;
}

function disableMintForms () {
  Array.from(document.querySelectorAll(
    "#address-mint input, #address-mint button"
  )).forEach(element => element.disabled = true);
}

function enableMintForms () {
  Array.from(document.querySelectorAll(
    "#address-mint input, #address-mint button"
  )).forEach(element => element.disabled = false);
}

////////////////////////////////////////////////////////////////////////
// Gui Event Handlers.
////////////////////////////////////////////////////////////////////////

async function handleCheckAura (e) {
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
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeMint(symbol, amount);
}

async function handleMintUtils (e) {
  return handleMint("UTIL", e);
}

async function handleMintAura (e) {
  return handleMint("AURA", e);
}

function handleApproveUtils (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeApproveUtils(amount);
}

async function handleBurnUtilForInu (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeBurnUtilForInu(amount);
}

async function handleConnectAddress (e) {
  e.preventDefault();
  const [ address ] = await walletClient.requestAddresses();
  if (address) {
    setWalletAddress(address);
    hide("connect-address");
    show("disconnect-address");
    enableMintForms();
    await updateBalances();
    balanceIntervalId = setInterval(updateBalances, 10000);
  }
  return false;
}

function handleDisconnectAddress (e) {
  e.preventDefault();
  setWalletAddress(false);
  show("connect-address");
  hide("disconnect-address");
  disableMintForms();
  clearInterval(balanceIntervalId);
  balanceIntervalId = undefined;
  document.getElementById("util-balance").innerHTML = "-";
  document.getElementById("inu-balance").innerHTML = "-";
  document.getElementById("aura-balance").innerHTML = "-";
  return false;
}

function onSubmit (id, handler) {
  document.getElementById(id)
    .addEventListener("submit", handler);
}

async function updateBalances () {
  if (walletAddress) {
    document.getElementById("util-balance").innerHTML =
      await readBalance("UTIL");
    document.getElementById("inu-balance").innerHTML =
      await readBalance("INU");
    document.getElementById("aura-balance").innerHTML =
      await readBalance("AURA");
  }

}

export function init () {
  const chain = anvil; //mainnet,
  publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  walletClient = createWalletClient({
    chain,
    transport: custom(window.ethereum),
  });
  onSubmit("connect-address", handleConnectAddress);
  onSubmit("disconnect-address", handleDisconnectAddress);
  onSubmit("mint-util", handleMintUtils);
  onSubmit("mint-aura", handleMintAura);
  onSubmit("approve-utils", handleApproveUtils);
  onSubmit("burn-utils", handleBurnUtilForInu);
  onSubmit("check-aura", handleCheckAura);
}