var JwToken = artifacts.require("./JwToken.sol");
var JwTokenSale = artifacts.require("./JwTokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");
require('dotenv').config({path: '../.env'});

module.exports = async function(deployer) {
  let address = await web3.eth.getAccounts();
  await deployer.deploy(JwToken,process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(JwTokenSale,1,address[0],JwToken.address,KycContract.address);

  let tokenInstance = await JwToken.deployed();
  await tokenInstance.transfer(JwTokenSale.address,process.env.INITIAL_TOKENS);
};
