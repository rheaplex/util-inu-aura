'use client';

// @ts-check

import { defineConfig } from '@wagmi/cli';

import fs from 'fs';
import path from 'path';

const CONTRACTS = ['Util', 'Inu', 'Aura'];
const OUT = './out';
const BROADCAST = './broadcast/Deploy.s.sol';

function getChainIds () {
  return fs.readdirSync(BROADCAST);
}

function getAbi (contractName) {
  const json = JSON.parse(fs.readFileSync(
    path.join(OUT, `${contractName}.sol`, `${contractName}.json`),
    'utf8'
  ));
  return json.abi;
}

function getAddress (contractName, chainId) {
  //FIXME: we read once for each contract, this is wasteful.
  const run = JSON.parse(fs.readFileSync(
    path.join(BROADCAST, chainId, 'run-latest.json'),
    'utf8'
  ));

  return run.transactions
    .find(
      tx =>  (tx.transactionType == 'CREATE')
        && (tx.contractName == contractName)
    ).contractAddress;
}

function getAddresses (contractName, chainIds) {
  const addresses = {};
  chainIds.forEach(chainId => {
    addresses[chainId] =  getAddress(contractName, chainId);
  });
  return addresses;
}

function getContracts () {
  const chainIds = getChainIds();
  return CONTRACTS.map(contractName => {
    return ({
      name: contractName,
      abi: getAbi(contractName),
      address: getAddresses(contractName, chainIds)
    });

  });
}

/** @type {import('@wagmi/cli').Config} */
export default defineConfig({
  out: 'app/generated.js',
  contracts: getContracts()
});
