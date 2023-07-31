// require('dotenv').config();

let contractAddress = "0x70dE848Ec334E549600F31497AF8e7ef1Cae9Be4";
let contractAbi = [
  {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [{ "name": "", "type": "address" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "token",
      "outputs": [{ "name": "", "type": "address" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "withdrawalAmount",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "lockTime",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [{ "name": "tokenAddress", "type": "address" }],
      "payable": true,
      "stateMutability": "payable",
      "type": "constructor"
  },
  {
      "constant": false,
      "inputs": [{ "name": "recipient", "type": "address" }],
      "name": "requestTokens",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [],
      "name": "",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "getBalance",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [{ "name": "amount", "type": "uint256" }],
      "name": "setWithdrawalAmount",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [{ "name": "amount", "type": "uint256" }],
      "name": "setLockTime",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "anonymous": false,
      "inputs": [
          { "indexed": true, "name": "to", "type": "address" },
          { "indexed": false, "name": "amount", "type": "uint256" }
      ],
      "name": "Withdrawal",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          { "indexed": true, "name": "from", "type": "address" },
          { "indexed": false, "name": "amount", "type": "uint256" }
      ],
      "name": "Deposit",
      "type": "event"
  }
];

const API_URL = "https://goerli.infura.io/v3/9e87bdd3ecff41568a661c916df3c818";
// const PRIVATE_KEY = process.env.PRIVATE_KEY
  

//async function
const provider = new ethers.providers.JsonRpcProvider(API_URL);
console.log({ provider });
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
console.log({ signer });
const contract = new ethers.Contract(contractAddress, contractAbi, signer); //signer = our acct that calls
console.log({ contract });
async function drip() {
    var address = document.getElementById("address");
    var cand = document.getElementById("status");
    
    cand.innerHTML = "Please wait, tranferring Tokens";
     try {
      const tx = await contract.requestTokens(address.value);
      await tx.wait();
      console.log("Transaction hash", tx.hash);
      cand.innerHTML= "Tokens transferred";
     } catch (error) {
      console.log(error);
      cand.innerHTML= `${error.message} error, try again later`
     }
     
}

//export functions
// module.exports = drip; 