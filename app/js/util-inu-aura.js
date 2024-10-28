/* global BigInt, FormData */

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
let auraSound;
let unwatchAuraFun;
let balanceIntervalId;

////////////////////////////////////////////////////////////////////////
// Http/ipfs network access.
////////////////////////////////////////////////////////////////////////

async function fetchMetadata () {
  const tokenUri = await publicClient.readContract({
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
  setGuiAura();
}

async function unwatchAura () {
  if (unwatchAuraFun) {
    await unwatchAuraFun();
    unwatchAuraFun = null;
  }
}

async function watchAura () {
  unwatchAura();
  const chainId = await publicClient.getChainId();
  unwatchAuraFun = publicClient.watchContractEvent({
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

async function writeTransfer (symbol, address, amount) {
  const chainId = await walletClient.getChainId();
  return walletClient.writeContract({
    abi: ABIS[symbol],
    address: ADDRESSES[symbol][chainId],
    functionName: 'transfer',
    args: [ address, BigInt(amount) ],
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

function show (element) {
  document.getElementById(element).style.display = "block";
}

function hide (element) {
  document.getElementById(element).style.display = "none";
}

function setWalletAddress (address) {
  walletAddress = address || false;
  [...document.getElementsByClassName("wallet-address")]
    .forEach(element => element.innerHTML = walletAddress || "—");
}

function setGuiAura () {
  if (imgUrl) {
    document.getElementById("aura").src = imgUrl;
  } else {
    document.getElementById("aura").src = undefined;
  }
  if (imgUrl && aura) {
    document.getElementById("aura").classList.add('img-aura');
    auraSound.play();
  } else {
    document.getElementById("aura").classList.remove('img-aura');
    auraSound.pause();
  }
}

async function leaveAuraDisplay () {
  document.getElementById("aura").src = undefined;
  document.getElementById("aura").classList.remove('img-aura');
  show("gui");
  hide("display");
  tokenAddress = null;
  tokenId = null;
  metadata = null;
  imgUrl = null;
  aura = null;
  auraSound.pause();
  return unwatchAura();
}

function disableMintForms () {
  Array.from(document.querySelectorAll(
    "#address-mint input, #address-mint button"
  )).forEach(element => element.disabled = true);
}

function enableMintForms () {
  Array.from(document.querySelectorAll(
    ".address-required input, .address-required button"
  )).forEach(element => element.disabled = false);
}

////////////////////////////////////////////////////////////////////////
// Gui Event Handlers.
////////////////////////////////////////////////////////////////////////

async function handleCheckAura (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  tokenAddress = formData.get('address');
  tokenId = parseInt(formData.get('id').trim());
  await fetchMetadata();
  await readAura();
  setGuiAura();
  document.getElementById("display").style.display = "flex";
  hide("gui");
  return watchAura();
}

async function handleMintTokens (e) {
  e.preventDefault();
  const symbol = e.submitter.name;
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeMint(symbol, amount);
}

async function handleTransferTokens (e) {
  e.preventDefault();
  const symbol = e.submitter.name;
  const formData = new FormData(e.target);
  const address = formdata.get("address");
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  return writeTransfer(symbol, amount, address);
}

async function handleActionsTokens (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const amount = formData.get('amount');
  e.target.elements["amount"].value = "";
  switch (e.submitter.name) {
  case "approve-util":
    return writeApproveUtils(amount);
    break;
  case "burn-util":
    return writeBurnUtilForInu(amount);
  default:
    return null;
  }
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
  auraSound = new Audio("./resources/aura.ogg");
  auraSound.loop = true;
  onSubmit("connect-address", handleConnectAddress);
  onSubmit("disconnect-address", handleDisconnectAddress);
  onSubmit("mint-tokens", handleMintTokens);
  onSubmit("transfer-tokens", handleTransferTokens);
  onSubmit("other-actions-tokens", handleActionsTokens);
  onSubmit("check-aura", handleCheckAura);
  document.getElementById("aura").onclick = leaveAuraDisplay;
}
