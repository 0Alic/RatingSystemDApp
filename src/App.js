import React, { Component } from 'react';
import './App.css';
// React-bootstrap components
import Container  from 'react-bootstrap/Container';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
// My compontents
import RSF from './RSF.js';
import SearchBar from './SearchBar.js';
// Contracts
import RatingSystemFramework from './build/contracts/RatingSystemFramework.json';
import User from './build/contracts/User.json';
import Item from './build/contracts/Item.json';
import ComputerRegistry from './build/contracts/ComputerRegistry.json';
// Other contract related
import TruffleContract from 'truffle-contract';
import Web3 from 'web3';

class App extends Component {

  constructor(props) {
    super(props);

    // Init web3
    if (typeof web3 != 'undefined') {

      this.provider = window.ethereum;
      this.web3 = new Web3(this.provider);
      try {
          window.ethereum.enable().then(async () => {
              console.log("Privacy ok");
          });
      }
      catch (error) {
          console.log("New privacy feature testing, error");
          console.log(error);
      }
    } else {
        this.provider = new Web3.providers.HttpProvider('http://localhost:8545');
        this.web3 = new Web3(this.provider);
    }        

    // Create RSF abstraction
    this.rsfContract = TruffleContract(RatingSystemFramework);
    this.rsfContract.setProvider(this.provider);

    // Create Registry abstraction
    this.registryContract = TruffleContract(ComputerRegistry);
    this.registryContract.setProvider(this.provider);

    // Create User abstraction
    this.userContract = TruffleContract(User);
    this.userContract.setProvider(this.provider);

    // Create Item abstraction
    this.itemContract = TruffleContract(Item);
    this.itemContract.setProvider(this.provider);

  }

  render() {

    return(
      <div>

        <SearchBar 
            itemContract={this.itemContract}
        />

        <Container className="App">
          {/* Title Header */}
          <Row>
              <Col>
                  <h1>Boarderline</h1>
                  <h3>Board games recommended by board gamers</h3>
              </Col>
          </Row>

          {/* Here listing the information provided by Web3 */}
          <RSF  web3={this.web3}
                provider={this.provider}
                rsfContract={this.rsfContract}
                registryContract={this.registryContract}
                userContract={this.userContract}
                itemContract={this.itemContract}
          />

        </Container>
  
      </div>
    );
  }
}


export default App;
