import React, { Component } from 'react';
import './App.css';
import Login from './Login.js';
import Computer from './Computer';
import TruffleContract from 'truffle-contract';
import RatingSystemFramework from './build/contracts/RatingSystemFramework.json';
import User from './build/contracts/User.json';
import Item from './build/contracts/Item.json';
import ComputerRegistry from './build/contracts/ComputerRegistry.json'
import Web3 from 'web3'
import Container  from 'react-bootstrap/Container';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import TableOfContents from './TableOfContents.js';

class RSF extends Component {

    constructor(props) {

        super(props);

        this.state = {
            account: 0x0,
            users: null,
            items: null,
            loading: true,
            computers: undefined,
            currentComputer: 0
        }

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

    async componentWillMount() {

        // Read current Ethereum account
        this.web3.eth.getCoinbase((err, account) => {
            this.setState({ account: account });
        });

        // Get RatingSystemFramework INSTANCE
        this.rsf = await this.rsfContract.deployed();
        

        ///////////////////////////////
        ///////////////////////////////

        const usersAddresses = await this.rsf.getUsers(); // address[]

        // Retrieve user contracts
        let promises = [];
        let users = [];
        let itemAddresses = []; 
        let items = [];

        usersAddresses.forEach(u => {
            promises.push(this.userContract.at(u));
        });

        users = await Promise.all(promises); // TruffleContract[]


        ///////////////////////////////
        ///////////////////////////////

        // Retrieve item address lists
        promises = [];
        
        users.forEach((u) => {
            promises.push(u.getItems());   
        });

        itemAddresses = await Promise.all(promises); // address[][]

        // Retrieve item instances
        promises = [];

        itemAddresses.forEach((list) => {

            list.forEach((i) => {
                promises.push(this.itemContract.at(i));
            });
        });

        items = await Promise.all(promises); // TruffleContract[]

        ///////////////////////////////
        ///////////////////////////////

        // Retrieve ComputerRegistry instance
        const registryAddress = await this.rsf.computerRegistry();
        this.registry = await this.registryContract.at(registryAddress);

        // let ids = await this.registry.getIds();
        // this.setState({computers: ids.map(id => {
        //     return this.web3.utils.toUtf8(id);
        // })});
        
        // Set the state
        this.setState({ users: users, items: items, loading: false });  
        
        this.setComputer = this.setComputer.bind(this);
    }

    setComputer(computer) {
        // Computer is an intger >= 0
        this.setState({currentComputer: computer});
        // Call updateScore of Computer? Ma come?
    }

    render() {

        if(this.state.loading) {
            
            return(
                <div>
                    <Container className="App">
                        Loading...
                    </Container>
                </div>
            );
        }
        else {

            return(
                <div>                
                    {/* Here show the current Eth account */}
                    <Row>
                        <Col>
                            Account: {this.state.account}
                        </Col>
                    </Row>

                    {/* Here a couple of buttons */}
                    <hr/>
                    <Row>
                        <Col>
                            <Login 
                                rsf={this.rsf} 
                                account={this.state.account} 
                                userContract={this.userContract} 
                                web3={this.web3} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Computer 
                                rsf={this.rsf} 
                                web3={this.web3} 
                                provider={this.provider}
                                parent={this} />
                        </Col>
                    </Row>


                    {/* Here the table to show the items */}
                    <TableOfContents 
                        registry={this.registry}
                        items={this.state.items}
                        computer={this.state.currentComputer}
                        web3={this.web3}
                    />
                </div>
            );
        }
    }
}

export default RSF;
