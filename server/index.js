var express = require("express");
var LitJsSdk = require("lit-js-sdk/build/index.node.js");
var cors = require('cors');
var app = express();
require('dotenv').config();

///////////SETUP SERVER/////////////////////////////

const {
  SERVER_PORT,
  ENCRYPTED_FILE_LOCATION_BASE_URL_DEV,
  ENCRYPTED_FILE_LOCATION_BASE_URL_PROD,
  NFT_CONTRACT_ADDRESS_TESTNET,
  TOKENID_TESTNET,
  NFT_CONTRACT_ADDRESS_MAINNET,
  TOKENID_MAINNET,
  LIT_CHAIN_PROVIDER_TESTNET,
  LIT_CHAIN_PROVIDER_MAINNET,
  DECRYPT_SYMMETRIC_KEY,
} = process.env

console.log('STEP 1:INIT INITIAL PARAMETERS ')

const whiteList = [ENCRYPTED_FILE_LOCATION_BASE_URL_DEV, ENCRYPTED_FILE_LOCATION_BASE_URL_PROD];
const corsOptions = {
  credentials: true,
  origin: whiteList
};
app.use(cors(corsOptions));

const encryptedSymmetricKey = DECRYPT_SYMMETRIC_KEY;
const baseUrl = ENCRYPTED_FILE_LOCATION_BASE_URL_PROD != '' ? ENCRYPTED_FILE_LOCATION_BASE_URL_PROD : ENCRYPTED_FILE_LOCATION_BASE_URL_DEV
const url = baseUrl + '/unitybuild/2022.3/myunityapp.wasm.encrypted';
const chain = LIT_CHAIN_PROVIDER_MAINNET != '' ? LIT_CHAIN_PROVIDER_MAINNET : LIT_CHAIN_PROVIDER_TESTNET;
const accessControlConditions = 
[
  {
    contractAddress: NFT_CONTRACT_ADDRESS_MAINNET != '' ? NFT_CONTRACT_ADDRESS_MAINNET : NFT_CONTRACT_ADDRESS_TESTNET,
    standardContractType: 'ERC721',
    chain: LIT_CHAIN_PROVIDER_MAINNET != '' ? LIT_CHAIN_PROVIDER_MAINNET : LIT_CHAIN_PROVIDER_TESTNET,
    method: 'ownerOf',
    parameters: [TOKENID_MAINNET != '' ? TOKENID_MAINNET : TOKENID_TESTNET],
    returnValueTest: {
      comparator: '=',
      value: ':userAddress'
    },
  },
]

console.log('access contyrol condition:')
console.log(accessControlConditions)
/////////////////////////////////////////////////////


console.log('STEP 2: SETUP THE FUNCTIONS USED TO DECRYPT WASM FILES')

async function initAndDecrypt(authSig) {

  const encrypted = await fetch(url)
    .then(res => res.text())
    .then(response => { return response });

  const check = LitJsSdk.uint8arrayFromString(
    encryptedSymmetricKey,
    "base64"
  );
  console.log(check)

  const symmetricKey = await app.locals.litNodeClient.getEncryptionKey({
    accessControlConditions,
    // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string. 
    // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" 
    //which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
    toDecrypt: LitJsSdk.uint8arrayToString(check, "base16"),
    chain,
    //@ts-ignore
    //  authSig: JSON.parse(decodeURI(authSig))
    authSig
  })

  console.log(typeof encrypted)
  const arrayBuffer = LitJsSdk.uint8arrayFromString(
    encrypted,
    "base64"
  ).buffer;
  //@ts-ignore
  const blob = new Blob([arrayBuffer])

  console.log(blob)

  console.log('CHECK -->> :', arrayBuffer)

  const decryptedString = await LitJsSdk.decryptString(
    blob,
    symmetricKey
  );
  // console.log(decryptedString)
  return decryptedString

}

app.get("/decrypt", async function (req, res) {

  try {
    let authSig = JSON.parse(req.query.authSig)


    const decrypted = await initAndDecrypt(authSig)

    var buffer = Buffer.from(decrypted.split(',')[1], 'base64');

    res.writeHead(200, {
      'Content-Type': 'application/wasm',
      'Content-Length': buffer.length
    });
    res.end(buffer);
  } catch (e) {
    console.log(e)
    res.send('error');
  }
  console.log(req.query.authSig)

});

// BEGIN with server setup
var server = app.listen(SERVER_PORT, async function () {
  var host = server.address().address;
  var port = server.address().port;

  // You must store litNodeClient in some kind of global variable that
  // is accessible to all your endpoints that will interact with the Lit Network.
  // It's best to initialize it just once per server.
  app.locals.litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
  });
  await app.locals.litNodeClient.connect();

  console.log("Server app listening at http://%s:%s", host, port);
});
