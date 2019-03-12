import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import {TruffleContract} from 'truffle-contract';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: undefined,
            name: ""
        }
    }

    async componentWillMount() {

        const account = this.props.account; // Ethereum address
        const rsf = this.props.rsf;
        const userContract = this.props.userContract;

        const userAddress = await rsf.getMyUserContract({from: account});
        
        if(userAddress == 0x0) {
            this.setState({loading: true, user: undefined});
        }
        else {
            const user = await userContract.at(userAddress);
            this.name = this.props.web3.utils.toUtf8(await user.name());
            this.setState({loading: false, user: user});
        }
    }


    render() {

        if(!this.state.user) {
            // User not registered and/or still loading information

            return(
                <div>
                    Not registerd? Subscribe now!
                </div>
            );

        }
        else {

            return(
                <div>
                    <h2>Welcome back {this.name}!</h2>
                </div>
            );
    }
    }
}

export default Login;