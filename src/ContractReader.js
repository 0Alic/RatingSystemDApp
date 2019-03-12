import React, { Component } from 'react';
import './App.css';
import Login from './Login.js';
import Computer from './Computer';
import TruffleContract from 'truffle-contract';
import RatingSystemFramework from './build/contracts/RatingSystemFramework.json';
import User from './build/contracts/User.json';
import Item from './build/contracts/Item.json';
import Web3 from 'web3'
import Container  from 'react-bootstrap/Container';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import TableOfContents from './UiComponents/TableOfContents.js';

class ContractReader extends Component {


    render() {

        return(
            <div></div>
        )
    }
}


export default ContractReader;