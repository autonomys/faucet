require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/9e87bdd3ecff41568a661c916df3c818",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};