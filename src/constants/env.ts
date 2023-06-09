export const env = {
    TESTING_MODE: process.env.NEXT_PUBLIC_TESTING_MODE ?? 'true',
    //FRONTEND VARIABLES
    NFT_CONTRACT_ADDRESS_TESTNET : process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS_TESTNET ?? '0xff4fb093028d1e4be9f72936eadb386a79ab86f9',
    TOKENID_TESTNET : process.env.NEXT_PUBLIC_TOKENID_TESTNET ?? '8',
    NFT_CONTRACT_ADDRESS_MAINNET : process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS_MAINNET ?? '0xff4fb093028d1e4be9f72936eadb386a79ab86f9',
    TOKENID_MAINNET : process.env.NEXT_PUBLIC_TOKENID_MAINNET ?? '8',
    FRONTEND_BASE_URL_DEV : process.env.NEXT_PUBLIC_FRONTEND_BASE_URL_DEV ?? 'http://localhost:3000/',
    SERVER_BASE_URL_DEV : process.env.NEXT_PUBLIC_SERVER_BASE_URL_DEV ?? 'http://localhost:8091/',
    FRONTEND_BASE_URL_PROD : process.env.NEXT_PUBLIC_FRONTEND_BASE_URL_PROD ?? 'https://lit-unity-serverless-oconnor.vercel.app/',
    SERVER_BASE_URL_PROD : process.env.NEXT_PUBLIC_SERVER_BASE_URL_PROD ?? '',
   
    LIT_CHAIN_TESTNET : process.env.NEXT_PUBLIC_LIT_CHAIN_TESTNET ?? 'mumbai',
    LIT_CHAIN_MAINNET : process.env.NEXT_PUBLIC_LIT_CHAIN_MAINNET ?? 'mumbai',
    
    //SERVER VARIABLES
    SERVER_PORT:process.env.SERVER_PORT ?? '',
    ENCRYPTED_FILE_LOCATION_BASE_URL_DEV:process.env.NEXT_PUBLIC_ENCRYPTED_FILE_LOCATION_BASE_URL_DEV ?? 'http://localhost:3000/',
    ENCRYPTED_FILE_LOCATION_BASE_URL_PROD:process.env.NEXT_PUBLIC_ENCRYPTED_FILE_LOCATION_BASE_URL_PROD ?? 'https://lit-unity-serverless-oconnor.vercel.app/',
   
    DECRYPT_SYMMETRIC_KEY:process.env.NEXT_PUBLIC_DECRYPT_SYMMETRIC_KEY ?? 'RNV75z4cQGmbk07UICXoZZ5ZbBKRDBh8GKTgSFFGIM8V0+CeQ66uF8blBWW8wL4KVw7JPZ6wNaEzE+MLsYg1fUAbg/wnbp0DjGQkNtu+GkZWVBfYCSES19xj3asgqF6szvsJxrpTTBCfTEXavGQOD+HKwGFn/XzdcQsApYendZcAAAAAAAAAIOmWEJDMYEWW6jChqtTkcploFVc4hoSbJ0yKeIWa4NqXhIv++sXT2QSJh6FrTDSKiw',
    UNITY_APP_NAME : process.env.NEXT_PUBLIC_UNITY_APP_NAME ?? 'myunityapp',
    UNITY_BUILD_PATH : process.env.NEXT_PUBLIC_UNITY_BUILD_PATH ?? '/unitybuild/test/',
  };