import React, { Component } from "react";
import IndexSwap from "./abis/IndexSwap.json";
import IndexToken from "./abis/indexToken.json";
import IERC from "./abis/IERC20.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Grid, Button, Card, Header, Icon, Form, Input, Image, Label, Menu, Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import velvet from "./velvet.png";
import metamask from "./metamask-fox.svg";


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
      daiTokenBalance: 0,

      rate: 0
    }
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.calcTokenBalances();
    await this.getRate();
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

  connectWallet = async () =>{
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        console.log("Connected");
      } else {
        alert("Metamask not found");
      }

      this.loadBlockchainData();
      window.location.reload()
  }

  investNFT = async() => {
    const web3 = window.web3;
    const v = this.state.nftToMint;
    const amount = web3.utils.toWei(v, "ether");
    const resp = await this.state.SwapContract.methods.investInFundNFT().send({from: this.state.account, value: amount});
    if(resp.status) {
      window.alert("Investment successful!");
    } else {
      window.alert("Investment failed!");
    }

    this.calcTokenBalances();
  }

  investDeFi = async() => {
    const web3 = window.web3;
    const v = this.state.defiToMint;
    const amount = web3.utils.toWei(v, "ether");
    const resp = await this.state.SwapContract.methods.investInFundDeFi().send({from: this.state.account, value: amount});
    if(resp.status) {
      window.alert("Investment successful!");
    } else {
      window.alert("Investment failed!");
    }

    this.calcTokenBalances();
  }

  calcTokenBalances = async() => {
    const web3 = window.web3;

    const nftTokenBalanceRes = await this.state.NFTTokenContract.methods.balanceOf(this.state.account).call();
    const nftTokenBalance = web3.utils.fromWei(nftTokenBalanceRes, "ether");

    const defiTokenBalanceRes = await this.state.DeFiTokenContract.methods.balanceOf(this.state.account).call();
    const defiTokenBalance = web3.utils.fromWei(defiTokenBalanceRes, "ether");

    const USDTokenConntract = new web3.eth.Contract(IERC.abi, "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684");
    const usdtTokenBalanceRes = await USDTokenConntract.methods.balanceOf(this.state.account).call();
    const usdtTokenBalance = web3.utils.fromWei(usdtTokenBalanceRes, "ether");

    const BUSDTokenConntract = new web3.eth.Contract(IERC.abi, "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7");
    const busdTokenBalanceRes = await BUSDTokenConntract.methods.balanceOf(this.state.account).call();
    const busdTokenBalance = web3.utils.fromWei(busdTokenBalanceRes, "ether");

    const DAITokenConntract = new web3.eth.Contract(IERC.abi, "0x8a9424745056Eb399FD19a0EC26A14316684e274");
    const daiTokenBalanceRes = await DAITokenConntract.methods.balanceOf(this.state.account).call();
    const daiTokenBalance = web3.utils.fromWei(daiTokenBalanceRes, "ether");
    
    this.setState({ nftTokenBalance, defiTokenBalance, usdtTokenBalance, busdTokenBalance,daiTokenBalance });
  }

  getRate = async() => {
    const rateObj = await this.state.SwapContract.methods.currentRate().call();
    const rate = rateObj.numerator / rateObj.denominator;
    this.setState({ rate });
  }

  render() {
    return (
      <div className="App">
        <br></br>
        <Image src={velvet} size="medium" verticalAlign='middle'></Image>

        <Button style={{position:"absolute", top:"60px", right:"20px"}} onClick={this.connectWallet} color="orange">
          Connect to MetaMask
        </Button>

        <Grid divided='vertically'>
          <Grid.Row columns={2} style={{ margin: "20px" }}>
            <Grid.Column>

              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header style={{color: "white"}}>Top 5 DeFi Tokens</Card.Header>
                    <Card.Description>

                    <p style={{color: "#C0C0C0"}}>Rate: In return of investing 1 BNB you will receive {this.state.rate} DeFi Token.

</p>

                      <Form onSubmit={this.investDeFi}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to invest" name="defiToMint" onChange={this.handleInputChange}></Input>
                        <Button color="green" type="submit" style={{ margin: "20px", width: "150px" }}>Invest</Button>
                      </Form>

                      <Form>
                        <Input disabled style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to withdraw"></Input>
                        <Button disabled color="green" style={{ margin: "20px", width: "150px" }}>Withdraw</Button>
                      </Form>

                      <Table style={{"margin-left": "auto", "margin-right": "auto"}} basic='very' celled collapsing>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell style={{color: "white"}}>Token</Table.HeaderCell>
                            <Table.HeaderCell style={{color: "white"}}>Balance</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>DeFi Token</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.defiTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>USDT</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.usdtTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>BUSD</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.busdTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>DAI</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.daiTokenBalance}</Table.Cell>
                          </Table.Row>
                          
                        </Table.Body>
                      </Table>
            
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Card.Group>
            </Grid.Column>


            <Grid.Column>
              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header style={{color: "white"}}>Top 5 NFT Tokens</Card.Header>
                    <Card.Description>

                    <p style={{color: "#C0C0C0"}}>Rate: In return of investing 1 BNB you will receive {this.state.rate} NFT Token.</p>

                      <Form onSubmit={this.investNFT}>
                        <Input style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to invest" name="nftToMint" onChange={this.handleInputChange}></Input>
                        <Button color="green" type="submit" style={{ margin: "20px", width: "150px" }}>Invest</Button>
                      </Form>

                      <Form>
                        <Input disabled style={{ width: "300px", padding: 3 }} required type="text" placeholder="BNB amount to withdraw"></Input>
                        <Button disabled color="green" style={{ margin: "20px", width: "150px" }}>Withdraw</Button>
                      </Form>

                      <Table style={{"margin-left": "auto", "margin-right": "auto"}} basic='very' celled collapsing>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell style={{color: "white"}}>Token</Table.HeaderCell>
                            <Table.HeaderCell style={{color: "white"}}>Balance</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>NFT Token</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.nftTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>USDT</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.usdtTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>BUSD</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.busdTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>DAI</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.daiTokenBalance}</Table.Cell>
                          </Table.Row>
                          
                        </Table.Body>
                      </Table>

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

