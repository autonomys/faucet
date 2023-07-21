let contractAddress = "0xE56Cd3Cf62f0575309D2F5CF4D13A86c553068a4";
let contractAbi = [
 {
   "constant": false,
   "inputs": [],
   "name": "requestTokens",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "constant": true,
   "inputs": [],
   "name": "getBalance",
   "outputs": [
     {
       "internalType": "uint256",
       "name": "",
       "type": "uint256"
     }
   ],
   "stateMutability": "view",
   "type": "function"
 },
 {
   "constant": false,
   "inputs": [
     {
       "internalType": "uint256",
       "name": "amount",
       "type": "uint256"
     }
   ],
   "name": "setWithdrawalAmount",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "constant": false,
   "inputs": [
     {
       "internalType": "uint256",
       "name": "amount",
       "type": "uint256"
     }
   ],
   "name": "setLockTime",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "constant": false,
   "inputs": [],
   "name": "withdraw",
   "outputs": [],
   "stateMutability": "nonpayable",
   "type": "function"
 },
 {
   "inputs": [],
   "stateMutability": "nonpayable",
   "type": "receive"
 },
 {
   "inputs": [
     {
       "internalType": "address",
       "name": "tokenAddress",
       "type": "address"
     }
   ],
   "stateMutability": "nonpayable",
   "type": "constructor"
 },
 {
   "anonymous": false,
   "inputs": [
     {
       "indexed": true,
       "internalType": "address",
       "name": "to",
       "type": "address"
     },
     {
       "indexed": true,
       "internalType": "uint256",
       "name": "amount",
       "type": "uint256"
     }
   ],
   "name": "Withdrawal",
   "type": "event"
 },
 {
   "anonymous": false,
   "inputs": [
     {
       "indexed": true,
       "internalType": "address",
       "name": "from",
       "type": "address"
     },
     {
       "indexed": true,
       "internalType": "uint256",
       "name": "amount",
       "type": "uint256"
     }
   ],
   "name": "Deposit",
   "type": "event"
 }
];

const API_URL = "https://goerli.infura.io/v3/9e87bdd3ecff41568a661c916df3c818"
const PRIVATE_KEY = "your_private_key"
  
const provider = new ethers.providers.JsonRpcProvider(API_URL);
console.log({ provider });
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
console.log({ signer });
const contract = new ethers.Contract(contractAddress, contractAbi, signer);
console.log({ contract });
async function drip() {
    var address = document.getElementById("address");
    var cand = document.getElementById("status");
    console.log(address.value);
    
    cand.innerHTML = "Please wait, tranferring Tokens";
     
     // const tx = await contract.requestTokens(address.value);
     const tx = await contract.requestTokens();
     await tx.wait();
     cand.innerHTML= "Tokens transferred";
}