const Token = artifacts.require("JwToken");

const chai = require("./chaiSetup.js");
const BN = web3.utils.BN;

const expect = chai.expect;
require('dotenv').config({path: '../.env'});

contract("Test Token", function(accounts){
    const [initialHolder,Recipient,anotherAccount] = accounts;

    beforeEach(async()=>{
        this.JwToken = await Token.new(process.env.INITIAL_TOKENS);
    })

    it("All Token Should be in Owner",async ()=>{
        let instance = this.JwToken;
        //before using beforeEach
        //let instance = await Token.deployed();
        let totalSupply = await instance.totalSupply();
        
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        
    });

    it("Able to Send Token to another Account", async()=>{
        const sendAmount = 1;
        let instance = this.JwToken;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(Recipient,sendAmount)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendAmount)));
        return expect(instance.balanceOf(Recipient)).to.eventually.be.a.bignumber.equal(new BN(sendAmount));
        //Example of Error
        //await expect(instance.balanceOf(Recipient)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("Unable Send more Token than account has", async()=>{
        let instance = await this.JwToken;
        let balanceAccount = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(Recipient,new BN(balanceAccount+1))).to.eventually.be.rejected;

        //check balance still same
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceAccount);
    })

});