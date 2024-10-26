# UTIL / INU / AURA

UTIL: Utilitarian "utils" - a measure of value for utility functions.

INU: A measure of inutility - the waste, denial, or absence of utility.

AURA: The aura of art - its presence, cultural cachet, or specialness.

# Notes

Uses code from https://github.com/tokenbound/contracts .

# Development

## Run Tests

    forge test

## Deploy Locally

This is anvil's local account 0 key.

    anvil
    forge script script/Deploy.s.sol --broadcast --chain-id 31337 --rpc-url http://127.0.0.1:8545 \
        --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    yarn wagmi generate
    python -m http.server
