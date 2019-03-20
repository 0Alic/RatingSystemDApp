import React, { Component } from 'react';
import './App.css';
import Login from './Login.js';
import Container  from 'react-bootstrap/Container';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import TableOfContents from './TableOfContents.js';

/**
 * This component is in charge to 
 * - initialize web3
 * - load all the contract abstraction and create a TruffleContract
 * - Retrieve the instances of RatingSystemFramework and Registry
 * - right now I use "deployed", even if isn't correct if there are more of them around
 * 
 */
class RSF extends Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: true,
            account: 0x0,       // current Eth account
            users: null,        // users of RSF
            items: null,         // items of RSF
            user: undefined
        }

    }

    async componentWillMount() {

        const web3 = this.props.web3;
        const rsfContract = this.props.rsfContract;
        const userContract = this.props.userContract;
        const itemContract = this.props.itemContract;
        const registryContract = this.props.registryContract;

        let account = 0x0;

        // Read current Ethereum account
        web3.eth.getCoinbase((err, _account) => {
    
            account = _account;
            // this.setState({ account: account });
        });

        // Get RatingSystemFramework INSTANCE
        this.rsf = await rsfContract.deployed();
        

        ///////////////////////////////
        ///////////////////////////////

        const usersAddresses = await this.rsf.getUsers(); // address[]

        // Retrieve user contracts
        let promises = [];
        let users = [];
        let itemAddresses = []; 
        let items = [];

        usersAddresses.forEach(u => {
            promises.push(userContract.at(u));
        });

        users = await Promise.all(promises); // instance[]


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
                promises.push(itemContract.at(i));
            });
        });

        items = await Promise.all(promises); // instance[]

        ///////////////////////////////
        ///////////////////////////////

        // Retrieve ComputerRegistry instance
        const registryAddress = await this.rsf.computerRegistry();
        this.registry = await registryContract.at(registryAddress);
        
        
        ///////////////////////////////
        ///////////////////////////////

        const userAddress = await this.rsf.getMyUserContract({from: account});
        let user = undefined;

        if(userAddress !== 0x0)
            user = await userContract.at(userAddress);

        // Set the state
        this.setState({ users: users, items: items, loading: false, user: user });

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

            const web3 = this.props.web3;
            const provider = this.props.provider;
            const userContract = this.props.userContract;

            return(
                <div>                
                    {/* Here show the current Eth account */}
                    <Row>
                        <Col>
                            Account: {this.state.account}
                        </Col>
                    </Row>


                    {/* Welcome / Login form */}
                    <hr/>
                    <Row>
                        <Col>
                            <Login 
                                user={this.state.user}
                                // rsf={this.rsf} 
                                // account={this.state.account} 
                                // userContract={userContract} 
                                // web3={web3} 

                                />
                        </Col>
                    </Row>

                    <hr />

                    {/* Here the table to show the items */}
                    <TableOfContents
                        user={this.state.user}
                        userContract={userContract}
                        registry={this.registry}
                        items={this.state.items}
                        web3={web3}
                        provider={provider}
                    />
                </div>
            );
        }
    }
}

export default RSF;
