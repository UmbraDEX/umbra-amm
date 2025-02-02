# Umbra DEX

[![Netlify Status](https://api.netlify.com/api/v1/badges/27a8d059-9816-447e-bd0b-940b8e086a8e/deploy-status)](https://app.netlify.com/sites/umbra-dex/deploys)

A decentralized exchange (DEX) implementation on the Eclipse chain. This project enables users to create and manage liquidity pools, swap tokens, and participate in decentralized trading on Eclipse.

## Overview

Umbra DEX is a powerful AMM (Automated Market Maker) implementation that uses Raydium's battle-tested contracts adapted for the Eclipse chain. It provides essential DEX functionality including:

- Token creation
- Liquidity pool creation and management
- AMM configuration
- Token swapping capabilities

## Dependencies
- Rust: v1.79.0
- Anchor: v0.29.0
- Solana: v1.17.34

## Building and Deployment

1. Build the project:
```bash
anchor build
```

2. Deploy to the network:
```bash
anchor deploy
```

## Testing

To run the tests, follow these steps:

1. Install dependencies:
```bash
yarn install
```

2. Run the test suite:
```bash
anchor test
```