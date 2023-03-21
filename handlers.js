const ethers = require("ethers");
const fs = require("fs");
const path = require("path");
const { _callFunction, _pureFunction } = require("./helpers.js");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log(`Wallet address: ${wallet.address}`);

// Обращение к функциям контракта
async function callContract(contractName, contractAddress) {
  const contractAbiPath = path.resolve(
    __dirname,
    "contracts",
    contractName + ".abi"
  );
  const contractAbi = fs.readFileSync(contractAbiPath, "utf8");
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
  let curNote = await _pureFunction(contract, "getNote");
  console.log(`First request of note: '${curNote.txResponse}'`);
  const setNote = await _callFunction(contract, "setNote", 0, ["My any note"]);
  console.log(`Transaction tx: ${setNote.txReceipt}`);
  curNote = await _pureFunction(contract, "getNote");
  console.log(`New note: '${curNote.txResponse}'`);
}

callContract("Note", "0xdfDbA51F02bA2211e1Eb223b924631a31FFeBd50")
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
