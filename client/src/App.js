import React, { Component } from "react";
import JwToken from "./contracts/JwToken.json";
import JwTokenSale from "./contracts/JwTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    loaded:false,
    kycAddress:"0x123...",
    jwToknSaleAddress:"", 
    userTokens: 0,
    jwSupply: 0
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      //Metamask Obsolete
      //this.networkId = await this.web3.eth.net.getId();
      this.networkId = await this.web3.eth.getChainId();

      this.JwToken = new this.web3.eth.Contract(
        JwToken.abi,
        JwToken.networks[this.networkId] && JwToken.networks[this.networkId].address,
      );
      this.JwTokenSale = new this.web3.eth.Contract(
        JwTokenSale.abi,
        JwTokenSale.networks[this.networkId] && JwTokenSale.networks[this.networkId].address,
      );
      this.kycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({ loaded:true ,jwToknSaleAddress: this.JwTokenSale._address},this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  handleInputChange = (event)=>{
    const target = event.target;
    const value = target.type ==="checkbox"? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]:value
    })
  }

  handleKycSubmit = async () =>{
    const {kycAddress} = this.state;
    await this.kycContract.methods.setKycCompleted(kycAddress).send({from:this.accounts[0]});
    alert("Account" +kycAddress+"is now Whitelisted");
  }

  handleBuyToken = async () =>{
    await this.JwTokenSale.methods.buyTokens(this.accounts[0]).send({from:this.accounts[0],value:1});
  }

  updateUserTokens = async() => {
    let userTokens = await this.JwToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
    let _jwSupply = await this.JwToken.methods.totalSupply().call();
    this.setState({jwSupply:_jwSupply});
  }

  listenToTokenTransfer = async() => {
    this.JwToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }



  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="Header">
          <h1>Jw Token</h1>
          <p>Token for using Jw Application</p>
        </div>
        <div>
          <p>Activate your account first before Transaction!</p>
          Address : <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
          <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelist</button>
        </div>
        <div>
          <p>Buy Jw Token here</p>
          <p>Send Ether to this address : {this.state.jwToknSaleAddress}</p>
        </div>
        <div>
          <p>You have : {this.state.userTokens}</p>
          <button type="button" onClick={this.handleBuyToken}>Buy One Token</button>
        </div>
        <div>
          <p>Current Supply : {this.state.jwSupply} JW Token</p>
        </div>
        
      </div>
    );
  }
}

export default App;
