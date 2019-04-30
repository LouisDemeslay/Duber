const assert = require('assert');
const truffleAssert = require('truffle-assertions');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface,bytecode } = require('../compile');

let accounts;
let store;

beforeEach(async()=>{
  accounts = await web3.eth.getAccounts();
  store = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:'0x'+bytecode})
    .send({from:accounts[0], gas:'1000000'})
})

describe('Duber', ()=>{
  it('deploy the contract', ()=>{
    assert.ok(store.options.address);
  })
  it('should set the owner variable',async()=>{
    const owner = await store.methods.owner().call();
    assert.equal(accounts[0], owner)
  })
  it('should have 0 product',async()=>{
    const product = await store.methods.numberOfProducts().call();
    assert.equal(0, product)
  })
  it('should create a product', async()=>{
    await store.methods.createProduct("stylos","lot de stylos", 200).send({from:accounts[0]});
    const productNumber = await store.methods.numberOfProducts().call();
    assert.equal(1, productNumber);
    const product = await store.methods.getProducts("stylos").call();
    assert.equal(product[0], "lot de stylos");
    assert.equal(product[1], 200);
  })
  it('should not allow someone else than the owner to create a product',async()=>{
     await truffleAssert.reverts( store.methods.createProduct("stylos","lot de stylos", 200).send({from:accounts[1], gas:'1000000'}))  ;
  })
  it('should create an order',async()=>{
    await store.methods.order("12 rue de sebastien", 'stylos').send({from:accounts[1], gas:'1000000',value:1});
    const order = await store.methods.getOrders().call();
    assert.equal(order.product,'stylos');
    assert.equal(order.deliveryAddress,'12 rue de sebastien');
  })
  it('should not create an order if the price is bellow the price of the product',async()=>{
      await truffleAssert.reverts(store.methods.order("12 rue de sebastien", 'stylos').send({from:accounts[1], gas:'1000000',value:0}));
  })

})
