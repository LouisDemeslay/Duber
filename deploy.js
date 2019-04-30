const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const {interface,bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'captain kitten phrase unique return pilot camp fly list wreck rate ill',
  'https://ropsten.infura.io/v3/d4d36e8586154352beaabcb9df651ec1'
);

const web3 = new Web3(provider);

const deploy = async() => {
  const accounts =  await web3.eth.getAccounts();


  console.log('Attempting to deploy from : ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:'0x'+bytecode})
    .send({from:accounts[0]})

    console.log(result.options.address);
}

deploy();
