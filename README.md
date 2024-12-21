# UTIL / INU / AURA

UTIL: Utilitarian "utils" - a measure of value for utility functions.

https://etherscan.io/address/0xcbbb81a8f6cdd484b6375329589a1b81bf1a2fea

INU: A measure of inutility - the waste, denial, or absence of utility.

https://etherscan.io/address/0xacd70babcbe33f2e38d7330b189a6412150aecc6

AURA: The aura of art - its presence, cultural cachet, or specialness.

https://etherscan.io/address/0xa2d06567ac268a54d15fdee7e809c52d2b9f0f74

# Displaying a Single NFT

You can pass the NFT's `contract` address and token `id` as query parameters to the app, e.g.:

    app?contract=0xa513E6E4b8f2a923D98304ec87F64353C4D5C853&id=1

Note that you will need to approve the sound autoplay using this method if you wish to hear it.

# Notes

Uses code from https://github.com/tokenbound/contracts .

Uses sound from https://freesound.org/people/magnuswaker/sounds/581166/

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

## Deploy to Mainnet

    export MAINNET_RPC_URL="xxx"
    export ETHERSCAN_KEY="xxx"
    export SENDER_ADDRESS="xxx"
    export DERIVATION_PATH="xxx"

    forge script script/Deploy.s.sol:Deploy \
        --rpc-url "${MAINNET_RPC_URL}" \
        --etherscan-api-key "${ETHERSCAN_KEY}" \
        --sender "${SENDER_ADDRESS}" \
        --mnemonic-derivation-paths "${DERIVATION_PATH}" \
        --trezor --broadcast --verify -vvvv
