require("dotenv").config()
const { ethers, JsonRpcProvider } = require('ethers');
const {Client, IntentsBitField, Collection, time} = require('discord.js');



let contractAddress = process.env.CONTRACT_ADDRESS

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

const INFURA_GOERLI_ENDPOINT = process.env.INFURA_GOERLI_ENDPOINT
const PRIVATE_KEY = process.env.PRIVATE_KEY


//async function
const provider = new ethers.providers.JsonRpcProvider(INFURA_GOERLI_ENDPOINT);
console.log({ provider });
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
console.log({ signer });
const contract = new ethers.Contract(contractAddress, contractAbi, signer); //signer = our acct that calls
console.log({ contract });

async function drip(address) {
    const tx = await contract.requestTokens(address);
    await tx.wait();
    console.log("success");
    return tx;
}


//intents are set of permissions bot can use 
//guild is a server
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

//listens when bot is ready
client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`)
} );


client.on('messageCreate', (message)=>{

    //check if person is bot, if yes do nothing
    if(message.author.bot) {
        return;
    }
});


//listen to interactions/event listener
client.on('interactionCreate', async (interaction) => {

   const cooldown = new Set();
   const member = interaction.member;

    if (!interaction.isChatInputCommand()) return; //check if chatInput command

    try{
        if(interaction.commandName === 'request_tokens') {
            
            await interaction.deferReply(); //allows longer 3-second response
           
            //ephermal, msg only available to user who initiated interaction
    
            const address = interaction.options.get('address').value;
            const tx = await drip(address);
            const hash = tx.hash;
            console.log(member);
            interaction.followUp("The transaction hash is: " + hash + "\n\nTokens transferred!")
                .then(response => {
                    if (member.roles.cache.some(role => role.name !== 'Admin')) { //switch roles later 
                        member.timeout(10_000);
                        console.log("check");
                        interaction.followUp("You have been timed-out for 10 seconds");

                        //check if dev role, if not add 
                        if(member.roles !== '1141410292224512141'){
                            member.roles.add('1141410292224512141');
                        }
                    }
                });                
            }
    } catch(error){

        let errorMessage = error.message;
        
        if (error.error.reason.split('reverted: ')[1] == "Insufficient balance in faucet for withdrawal request") {
            errorMessage = "Insufficient balance in faucet for withdrawal request";
            interaction.followUp(`${errorMessage}, try again later.`);
        }
        else if (error.error.reason.split('reverted: ')[1] == "Insufficient time elapsed since last withdrawal - try again later.") {
            errorMessage = "Insufficient time elapsed since last withdrawal";
            interaction.followUp(`${errorMessage}, try again later.`);
        }
        else if (error.error.reason.split('reverted: ')[1] == "Only the contract owner can call this function") {
            errorMessage = "Only the contract owner can call this function";
            interaction.followUp(`${errorMessage}, try again later.`);
        }
        else {
            interaction.followUp(`try again later.`);
        }
    }
  });
  

client.login(
    process.env.TOKEN
);
