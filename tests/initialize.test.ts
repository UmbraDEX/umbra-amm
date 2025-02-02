import * as anchor from "@coral-xyz/anchor";
import { Program, BN, web3 } from "@coral-xyz/anchor";
import { UmbraAmm } from "../target/types/umbra_amm";

import { getAccount, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { setupInitializeTest, initialize, calculateFee } from "./utils";
import { assert } from "chai";
import { PublicKey } from "@solana/web3.js";
import { publicKey, u64, bool } from '@solana/buffer-layout-utils';
import { struct, u16, u8 } from '@solana/buffer-layout';

interface RawAmmConfig {
  bump: number;
  disable_create_pool: boolean;
  index: number;
  trade_fee_rate: bigint;
  protocol_fee_rate: bigint;
  fund_fee_rate: bigint;
  create_pool_fee: bigint;
  protocol_owner: PublicKey;
  fund_owner: PublicKey;
  // padding: number[];
}
const AmmConfigLayout = struct<RawAmmConfig>([
  u8('bump'),
  bool('disable_create_pool'),
  u16('index'),
  u64('trade_fee_rate'),
  u64('protocol_fee_rate'),
  u64('fund_fee_rate'),
  u64('create_pool_fee'),
  publicKey('protocol_owner'),
  publicKey('fund_owner'),
]);





let connection = new web3.Connection("https://staging-rpc.dev2.eclipsenetwork.xyz");
describe("initialize test", () => {
  const owner = anchor.Wallet.local().payer;
  const provider = anchor.AnchorProvider.env();  

  console.log("provider connection: ", provider.connection.rpcEndpoint);
  anchor.setProvider(provider);
  
  console.log("owner: ", owner.publicKey.toString());

  const program = anchor.workspace.UmbraAmm as Program<UmbraAmm>;
  // program.provider.connection = connection;

  const confirmOptions = {
    skipPreflight: true,
  };

  const getAccountData = async (address: PublicKey) => {
    const account = await connection.getAccountInfo(address);    
    return account.data;
  }
  const getAmmConfig = async (address: PublicKey) => {
    const accountData = await getAccountData(address);
    const config = AmmConfigLayout.decode(accountData);
    return config;
  }

  it("create pool without fee", async () => {
    console.log('setupInitializeTest');
    const { configAddress } =
      await setupInitializeTest(
        program,
        connection,
        owner,
        {
          config_index: 0,
          tradeFeeRate: new BN(10),
          protocolFeeRate: new BN(1000),
          fundFeeRate: new BN(25000),
          create_fee: new BN(0),
        },
        { transferFeeBasisPoints: 0, MaxFee: 0 },
        confirmOptions
      );

    // const config = await getAmmConfig(configAddress);
    // console.log('config: ', config);


  //   const configAddress = new PublicKey("F8vHGYNxWoLWrLYJ6HrksGH7V8TQeqZJPeGNiYkfdYhN");
    const token0 = new PublicKey("mnthuBnrWBTiEHBU3Tbq6Nv7eaqV8kEEDBb9TYn6sEm");
    const token0Program = TOKEN_2022_PROGRAM_ID;
    const token1 = new PublicKey("mnttzJ2eWa6ZrRP42aWoybRm8X3aBrey9mXYvLP5k5q");
    const token1Program = TOKEN_2022_PROGRAM_ID;

    const initAmount0 = new BN(10000000000);
    const initAmount1 = new BN(10000000000);
    console.log('initialize');
    const { poolAddress, poolState } = await initialize(
      program,
      owner,
      configAddress,
      token0,
      token0Program,
      token1,
      token1Program,
      confirmOptions,
      { initAmount0, initAmount1 }
    );    


    let vault0 = await getAccount(
      connection,
      poolState.token0Vault,
      "processed",
      poolState.token0Program
    );
    assert.equal(vault0.amount.toString(), initAmount0.toString());

    let vault1 = await getAccount(
      connection,
      poolState.token1Vault,
      "processed",
      poolState.token1Program
    );
    assert.equal(vault1.amount.toString(), initAmount1.toString());
  });

  it("create pool with fee", async () => {
    const token0 = new PublicKey("mnthuBnrWBTiEHBU3Tbq6Nv7eaqV8kEEDBb9TYn6sEm");
    const token0Program = TOKEN_2022_PROGRAM_ID;
    const token1 = new PublicKey("mnttzJ2eWa6ZrRP42aWoybRm8X3aBrey9mXYvLP5k5q");
    const token1Program = TOKEN_2022_PROGRAM_ID;

    const { configAddress } =
      await setupInitializeTest(
        program,
        anchor.getProvider().connection,
        owner,
        {
          config_index: 0,
          tradeFeeRate: new BN(10),
          protocolFeeRate: new BN(1000),
          fundFeeRate: new BN(25000),
          create_fee: new BN(100000000),
        },
        { transferFeeBasisPoints: 0, MaxFee: 0 },
        confirmOptions
      );

    const initAmount0 = new BN(10000000000);
    const initAmount1 = new BN(10000000000);
    const { poolAddress, poolState } = await initialize(
      program,
      owner,
      configAddress,
      token0,
      token0Program,
      token1,
      token1Program,
      confirmOptions,
      { initAmount0, initAmount1 }
    );
    let vault0 = await getAccount(
      anchor.getProvider().connection,
      poolState.token0Vault,
      "processed",
      poolState.token0Program
    );
    assert.equal(vault0.amount.toString(), initAmount0.toString());

    let vault1 = await getAccount(
      anchor.getProvider().connection,
      poolState.token1Vault,
      "processed",
      poolState.token1Program
    );
    assert.equal(vault1.amount.toString(), initAmount1.toString());
  });

  it("create pool with token2022 mint has transfer fee", async () => {
    const transferFeeConfig = { transferFeeBasisPoints: 100, MaxFee: 50000000 }; // %10
    const { configAddress, token0, token0Program, token1, token1Program } =
      await setupInitializeTest(
        program,
        anchor.getProvider().connection,
        owner,
        {
          config_index: 0,
          tradeFeeRate: new BN(10),
          protocolFeeRate: new BN(1000),
          fundFeeRate: new BN(25000),
          create_fee: new BN(100000000),
        },
        transferFeeConfig,
        confirmOptions
      );

    const initAmount0 = new BN(10000000000);
    const initAmount1 = new BN(10000000000);
    const { poolAddress, poolState } = await initialize(
      program,
      owner,
      configAddress,
      token0,
      token0Program,
      token1,
      token1Program,
      confirmOptions,
      { initAmount0, initAmount1 }
    );
    let vault0 = await getAccount(
      anchor.getProvider().connection,
      poolState.token0Vault,
      "processed",
      poolState.token0Program
    );
    if (token0Program == TOKEN_PROGRAM_ID) {
      assert.equal(vault0.amount.toString(), initAmount0.toString());
    } else {
      const total =
        vault0.amount +
        calculateFee(
          transferFeeConfig,
          BigInt(initAmount0.toString()),
          poolState.token0Program
        );
      assert(new BN(total.toString()).gte(initAmount0));
    }

    let vault1 = await getAccount(
      anchor.getProvider().connection,
      poolState.token1Vault,
      "processed",
      poolState.token1Program
    );
    if (token1Program == TOKEN_PROGRAM_ID) {
      assert.equal(vault1.amount.toString(), initAmount1.toString());
    } else {
      const total =
        vault1.amount +
        calculateFee(
          transferFeeConfig,
          BigInt(initAmount1.toString()),
          poolState.token1Program
        );
      assert(new BN(total.toString()).gte(initAmount1));
    }
  });
});
