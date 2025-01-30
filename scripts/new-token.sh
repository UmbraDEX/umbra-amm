spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata scripts/keypairs/mnthuBnrWBTiEHBU3Tbq6Nv7eaqV8kEEDBb9TYn6sEm.json
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata scripts/keypairs/mnttzJ2eWa6ZrRP42aWoybRm8X3aBrey9mXYvLP5k5q.json
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata scripts/keypairs/mntPs3DJMqPnnE6zqf2q6eduM72cPWx4ALoKaoNpC5T.json

spl-token initialize-metadata mnthuBnrWBTiEHBU3Tbq6Nv7eaqV8kEEDBb9TYn6sEm 'Jito Staked SOL' 'JitoSOL' https://storage.cloud.google.com/eclipse-token-metadata/jito-metadata.json
spl-token initialize-metadata mnttzJ2eWa6ZrRP42aWoybRm8X3aBrey9mXYvLP5k5q 'Example token' 'EXMPL' https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
spl-token create-account mnttzJ2eWa6ZrRP42aWoybRm8X3aBrey9mXYvLP5k5q
spl-token create-account mnthuBnrWBTiEHBU3Tbq6Nv7eaqV8kEEDBb9TYn6sEm
spl-token mint mnttzJ2eWa6ZrRP42aWoybRm8X3aBrey9mXYvLP5k5q 100
spl-token mint mnthuBnrWBTiEHBU3Tbq6Nv7eaqV8kEEDBb9TYn6sEm 100

spl-token initialize-metadata mntPs3DJMqPnnE6zqf2q6eduM72cPWx4ALoKaoNpC5T 'Jito Staked SOL' 'JitoSOL' https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
spl-token create-account mntPs3DJMqPnnE6zqf2q6eduM72cPWx4ALoKaoNpC5T
spl-token mint mntPs3DJMqPnnE6zqf2q6eduM72cPWx4ALoKaoNpC5T 100
