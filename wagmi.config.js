// @ts-check

import contracts from '../contracts.json';

/** @type {import('@wagmi/cli').Config} */
export default {
  out: 'app/generated.js',
  contracts: contracts,
};
