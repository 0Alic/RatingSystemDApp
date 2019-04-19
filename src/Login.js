import React, { Component } from 'react';
import {Button, Form, Col } from 'react-bootstrap';
import InputForm from './InputForm.js';

/**
 * This component should display a welcome message to the user if registered
 * otherwise should display a button to register
 * 
 */
class Login extends Component {

    constructor(props) {
        super(props);

        this.createUser = this.createUser.bind(this);

        this.state = {
            user: undefined,
            name: "",
            address: ""
        }
    }


    async componentWillMount() {

        const user = this.props.user;
        let name = "";
        let userAddress = "";

        if(user) {
            name = await user.name(); 
            userAddress = user.address;
            name = this.props.web3.utils.toUtf8(name)
        }

        this.setState({ name: name, user: user, address: userAddress });
    }


    async createUser(e) {

        e.preventDefault();

        const userName = e.currentTarget.userName.value;
        const rsf = this.props.rsf;
        const web3 = this.props.web3;
        const account = this.props.account;

        if(userName === "") {
            alert("Blank game title");
            return;
        }

        if(userName.length > 32) {
            alert("Game title too long");
            return;
        }

        // Deploy Item
        await rsf.createUser(web3.utils.fromUtf8(userName), {from: account});
    }


    render() {

        if(!this.state.user) {
            // User not registered and/or still loading information
            return(
                <div>
                    <h4>Not registerd? Subscribe now!</h4>
                    <InputForm onSubmit={this.createUser} label="Choose a nickname" placeholder="Write nickname here" buttonText="Register to Boarderline!" id="userName"/>

                    {/* <Form onSubmit={e => this.createUser(e)}>
                            <Form.Group>
                                <Form.Label>Choose a nickname</Form.Label>
                            </Form.Group>
                            <Form.Row>
                                <Col>
                                    <Form.Control type="text" id="userName" placeholder="Write nickname here" />
                                </Col>
                                <Col>
                                    <Button type="submit">Register to Boarderline!</Button>
                                </Col>
                            </Form.Row>
                        </Form> */}
                </div>
            );

        }
        else {

            return(
                <div>
                    <h2>Welcome back {this.state.name}!</h2>
                    <p>Your User address: {this.state.address}</p>
                </div>
            );
    }
    }
}

export default Login;