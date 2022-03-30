import React, { Component } from "react";
import IndexSwap from "./abis/IndexSwap.json";
import IndexToken from "./abis/indexToken.json";
import IERC from "./abis/IERC20.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Grid, Button, Card, Form, Input, Image, Label, Menu, Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import velvet from "./velvet.png";
import metamask from "./metamask-fox.svg";
import swal from 'sweetalert';

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

      btcTokenBalance: 0,
      ethTokenBalance: 0,
      shibaTokenBalance: 0,
      xrpTokenBalance: 0,
      ltcTokenBalance: 0,

      axsTokenBalance: 0,
      manaTokenBalance: 0,
      sandTokenBalance: 0,
      thetaTokenBalance: 0,
      flowTokenBalance: 0,

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
      console.log('MetaMask is connected');

      window.web3 = new Web3(provider);
    } else {
      console.log('No ethereum wallet detected');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await window.web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const SwapContract = new web3.eth.Contract(IndexSwap.abi, "0xc15B79570f727A334fA13de8801cCF6B1BA16973");
    const NFTTokenContract = new web3.eth.Contract(IndexToken.abi, "0xE870b73661Cc3De504FE26111748c08224EDBf63");
    const DeFiTokenContract = new web3.eth.Contract(IndexToken.abi, "0xAe24BD25B1Aba33f69e97074aF954b1BF84B72Cb");
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
      swal("Investment successfull!", `You invested ${v} BNB into the NFT Portfolio.`, "success");

    } else {
      swal("Investment failed!");
    }

    this.calcTokenBalances();
  }

  investDeFi = async() => {
    const web3 = window.web3;
    const v = this.state.defiToMint;
    const amount = web3.utils.toWei(v, "ether");
    const resp = await this.state.SwapContract.methods.investInFundDefi().send({from: this.state.account, value: amount});
    if(resp.status) {
      swal("Investment successfull!", `You invested ${v} BNB into the DeFi Portfolio.`, "success");

    } else {
      swal("Investment failed!");
    }

    this.calcTokenBalances();
  }

  calcTokenBalances = async() => {
    const web3 = window.web3;

    const nftTokenBalanceRes = await this.state.NFTTokenContract.methods.balanceOf(this.state.account).call();
    const nftTokenBalance = web3.utils.fromWei(nftTokenBalanceRes, "ether");

    const defiTokenBalanceRes = await this.state.DeFiTokenContract.methods.balanceOf(this.state.account).call();
    const defiTokenBalance = web3.utils.fromWei(defiTokenBalanceRes, "ether");

    const BTCTokenConntract = new web3.eth.Contract(IERC.abi, "0x419816F160C9bf1Bb8F297d17E1bF44207B9E06C");
    const btcTokenBalanceRes = await BTCTokenConntract.methods.balanceOf(this.state.account).call();
    const btcTokenBalance = web3.utils.fromWei(btcTokenBalanceRes, "ether");

    const ETHTokenConntract = new web3.eth.Contract(IERC.abi, "0x8BaBbB98678facC7342735486C851ABD7A0d17Ca");
    const ethTokenBalanceRes = await ETHTokenConntract.methods.balanceOf(this.state.account).call();
    const ethTokenBalance = web3.utils.fromWei(ethTokenBalanceRes, "ether");

    const SHIBATokenConntract = new web3.eth.Contract(IERC.abi, "0xb950614981c8bc650744347293e3AC4Ea8ff123B");
    const shibaTokenBalanceRes = await SHIBATokenConntract.methods.balanceOf(this.state.account).call();
    const shibaTokenBalance = web3.utils.fromWei(shibaTokenBalanceRes, "ether");

    const XRPTokenConntract = new web3.eth.Contract(IERC.abi, "0x53E5D0c3702Fb163C8650ee74697BE9beF38b9E5");
    const xrpTokenBalanceRes = await XRPTokenConntract.methods.balanceOf(this.state.account).call();
    const xrpTokenBalance = web3.utils.fromWei(xrpTokenBalanceRes, "ether");

    const LTCTokenConntract = new web3.eth.Contract(IERC.abi, "0xC3c89a5Cd270BFB4f948CEF2151d818E3cB9bDD2");
    const ltcTokenBalanceRes = await LTCTokenConntract.methods.balanceOf(this.state.account).call();
    const ltcTokenBalance = web3.utils.fromWei(ltcTokenBalanceRes, "ether");

    const AXSTokenConntract = new web3.eth.Contract(IERC.abi, "0xf1955902806EE5b144691a3de9005951079d8458");
    const axsTokenBalanceRes = await AXSTokenConntract.methods.balanceOf(this.state.account).call();
    const axsTokenBalance = web3.utils.fromWei(axsTokenBalanceRes, "ether");

    const MANATokenConntract = new web3.eth.Contract(IERC.abi, "0xF5D59a1A7667c23EA6b369085b8C693bE6A6af5C");
    const manaTokenBalanceRes = await MANATokenConntract.methods.balanceOf(this.state.account).call();
    const manaTokenBalance = web3.utils.fromWei(manaTokenBalanceRes, "ether");

    const SANDTokenConntract = new web3.eth.Contract(IERC.abi, "0x54FA926a8C1241174aFd79F3F1Ea3219D11Afb7E");
    const sandTokenBalanceRes = await SANDTokenConntract.methods.balanceOf(this.state.account).call();
    const sandTokenBalance = web3.utils.fromWei(sandTokenBalanceRes, "ether");

    const THETATokenConntract = new web3.eth.Contract(IERC.abi, "0x2f6131AF2dcb1315BA63bCcd0a5E3a236A5C5c93");
    const thetaTokenBalanceRes = await THETATokenConntract.methods.balanceOf(this.state.account).call();
    const thetaTokenBalance = web3.utils.fromWei(thetaTokenBalanceRes, "ether");

    const FLOWTokenConntract = new web3.eth.Contract(IERC.abi, "0x190bB213CF401A4E5d8820b12198E92A858239C6");
    const flowTokenBalanceRes = await FLOWTokenConntract.methods.balanceOf(this.state.account).call();
    const flowTokenBalance = web3.utils.fromWei(flowTokenBalanceRes, "ether");
    
    this.setState({ nftTokenBalance, defiTokenBalance, btcTokenBalance, ethTokenBalance, shibaTokenBalance, xrpTokenBalance,
                    ltcTokenBalance, axsTokenBalance, manaTokenBalance, sandTokenBalance, thetaTokenBalance, flowTokenBalance });
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

        <Button style={{position:"absolute", top:"30px", right:"20px"}} onClick={this.connectWallet} color="orange">
        <Image style={{"padding-top": "7px"}} floated="left" size="mini" src={metamask}/>
        <p>Connect to MetaMask</p>
        </Button>

        <Grid divided='vertically'>
          <Grid.Row columns={2} style={{ margin: "20px" }}>
            <Grid.Column>

              <Card.Group>
                <Card style={{ width: "900px" }}>
                  <Card.Content style={{ background: "#406ccd" }}>
                    <Card.Header style={{color: "white"}}>Top 5 DeFi Tokens</Card.Header>
                    <Card.Description>

                    <p style={{color: "#C0C0C0"}}>Rate: In return of investing 1 BNB you will receive {this.state.rate} DeFi Token.</p>

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
                            <Table.Cell style={{color: "#C0C0C0"}}>Bitcoin (BTC)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.btcTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>Ethereum (ETH)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.ethTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>Shiba Ibu (SHIB)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.shibaTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>Ripple (XRP)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.xrpTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>Litecoin (LTC)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.ltcTokenBalance}</Table.Cell>
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
                            <Table.Cell style={{color: "#C0C0C0"}}>Axie Infinity (AXS)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.axsTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>Decentraland (MANA)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.manaTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>The Sandbox (SAND)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.sandTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>Theta Network (THETA)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.thetaTokenBalance}</Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell style={{color: "#C0C0C0"}}>Flow (FLOW)</Table.Cell>
                            <Table.Cell style={{color: "#C0C0C0"}}>{this.state.flowTokenBalance}</Table.Cell>
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

