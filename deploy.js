const ethers = require("ethers");
const solc = require("solc");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const ContractPathName = "Note.sol";

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log(`Wallet address: ${account.address}`);

async function saveBytecodeAndAbi(contractPathName) {
  const contractPath = path.resolve(__dirname, "contracts", contractPathName);
  const contractSource = fs.readFileSync(contractPath, "utf8");

  // Извлекаем имя контракта из исходного кода контракта
  const contractNameMatch = contractSource.match(/contract\s+(\w+)\s*\{/);
  const contractName = contractNameMatch ? contractNameMatch[1] : null;

  if (!contractName) {
    throw new Error("Could not find contract name");
  }

  const input = {
    language: "Solidity",
    sources: {
      [contractName]: {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contractData = output.contracts[contractName][contractName];

  // Извлечение ABI контракта
  const abi = JSON.stringify(contractData.abi, null, 2);
  // Сохраняем файл ABI
  const abiPath = path.resolve(
    path.dirname(contractPath),
    contractName + ".abi"
  );
  fs.writeFileSync(abiPath, abi);
  console.log(`ABI saved to ${abiPath}`);

  // Извлечение байткода контракта
  const bytecode = contractData.evm.bytecode.object;
  // Сохраняем файл байткода
  const bytecodePath = path.resolve(
    path.dirname(contractPath),
    contractName + ".bin"
  );
  fs.writeFileSync(bytecodePath, bytecode);
  console.log(`Bytecode saved to ${bytecodePath}`);

  return {
    ABI: abi,
    bytecode: bytecode,
  };
}

async function deploy(contractPathName) {
  const contratcFunc = await saveBytecodeAndAbi(contractPathName);

  const abi = contratcFunc.ABI;
  const binary = contratcFunc.bytecode;

  const contractFactory = new ethers.ContractFactory(abi, binary, account);
  console.log("Deploying...");
  const contract = await contractFactory.deploy(); // response

  // console.log(contract);
  const deploymentReceipt = await contract.deployTransaction.wait(1);
  console.log(`txHash: ${deploymentReceipt.transactionHash}`);
  console.log(`Contract address: ${contract.address}`);
}

deploy(ContractPathName)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
