import React, { Component } from "react";
import IndexSwap from "./abis/IndexSwap.json";
import IndexToken from "./abis/indexToken.json";
import IERC from "./abis/IERC20.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Grid, Button, Card, Header, HeaderSubheader, Form, Input } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      SwapContract: null,
      NFTTokenContract: null,
      DeFiTokenContract: null,
      address: "",

      defiToMint: 0,
      nftToMint: 0,
      defiBalance: 0,
      nftBalance: 0,

      nftTokenBalance: 0,
      defiTokenBalance: 0,
      usdtTokenBalance: 0,
      busdTokenBalance: 0,
      daiTokenBalance: 0
    }
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.calcTokenBalances();
  }

  // first up is to detect ethereum provider
  async loadWeb3() {
    const provider = await detectEthereumProvider();

    // modern browsers
    if (provider) {
      console.log('Ethereum wallet is connected');

      window.web3 = new Web3(provider);
    } else {
      console.log('No ethereum wallet detected');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await window.web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const SwapContract = new web3.eth.Contract(IndexSwap.abi, "0x38F6EDad57B87e412f4AdF0119d4f735E46DD802");
    const NFTTokenContract = new web3.eth.Contract(IndexToken.abi, "0x64a9057A0DbddDfB8A81b69ccf7536E4bAde0AbE");
    const DeFiTokenContract = new web3.eth.Contract(IndexToken.abi, "0xFd22F799B90888973dc841a11E6ED0cf24f0b7e4");
    this.setState({ SwapContract, NFTTokenContract, DeFiTokenContract });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  investNFT = async() => {
    const v = this.state.nftToMint;
    const resp = await this.state.SwapContract.methods.investInFundNFT().send({from: this.state.account, value: v});
    if(resp.status) {
      window.alert("Investment successful!");
    } else {
      window.alert("Investment failed!");
    }

    this.calcTokenBalances();
  }

  investDeFi = async() => {
    const v = this.state.defiToMint;
    const resp = await this.state.SwapContract.methods.investInFundDeFi().send({from: this.state.account, value: v});
    if(resp.status) {
      window.alert("Investment successful!");
    } else {
      window.alert("Investment failed!");
    }

    this.calcTokenBalances();
  }

  calcTokenBalances = async() => {
    const nftTokenBalance = await this.state.NFTTokenContract.methods.balanceOf(this.state.account).call();
    const defiTokenBalance = await this.state.DeFiTokenContract.methods.balanceOf(this.state.account).call();
    
    const web3 = window.web3;

    const USDTokenConntract = new web3.eth.Contract(IERC.abi, "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684");
    const usdtTokenBalance = await USDTokenConntract.methods.balanceOf(this.state.account).call();

    const BUSDTokenConntract = new web3.eth.Contract(IERC.abi, "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7");
    const busdTokenBalance = await BUSDTokenConntract.methods.balanceOf(this.state.account).call();

    const DAITokenConntract = new web3.eth.Contract(IERC.abi, "0x8a9424745056Eb399FD19a0EC26A14316684e274");
    const daiTokenBalance = await DAITokenConntract.methods.balanceOf(this.state.account).call();
    
    this.setState({ nftTokenBalance, defiTokenBalance, usdtTokenBalance, busdTokenBalance,daiTokenBalance });
  }

  render() {
    return (
      <div className="App">
        <br></br>
        <Header as='h1'>Velvet.Capital</Header>

        <Grid divided='vertically'>
          <Grid.Row columns={2} style={{ margin: "20px" }}>
            <Grid.Column>

              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header>DeFi</Card.Header>
                    <Card.Meta>Top 5 DeFi tokens</Card.Meta>
                    <Card.Description>

                      <Form onSubmit={this.investDeFi}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="Amount to mint" name="defiToMint" onChange={this.handleInputChange}></Input><br></br>
                        <Button color="green" type="submit" style={{ margin: "20px" }}>Invest!</Button>
                      </Form>

                      <h5>Balances</h5>

                      <p>DeFi Token: {this.state.defiTokenBalance}</p>
                      <p>USDT Token: {this.state.usdtTokenBalance}</p>
                      <p>BUSD Token: {this.state.busdTokenBalance}</p>
                      <p>DAI Token: {this.state.daiTokenBalance}</p>
            
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>
            </Grid.Column>


            <Grid.Column>
              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header>NFT</Card.Header>
                    <Card.Meta>Top 5 NFT tokens</Card.Meta>
                    <Card.Description>

                      <Form onSubmit={this.investNFT}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="Amount to mint" name="nftToMint" onChange={this.handleInputChange}></Input><br></br>
                        <Button color="green" type="submit" style={{ margin: "20px" }}>Invest!</Button>
                      </Form>

                      <h5>Balances</h5>

                      <p>NFT Token: {this.state.nftTokenBalance}</p>
                      <p>USDT Token: {this.state.usdtTokenBalance}</p>
                      <p>BUSD Token: {this.state.busdTokenBalance}</p>
                      <p>DAI Token: {this.state.daiTokenBalance}</p>

                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div >
    );
  }
}

export default App;

