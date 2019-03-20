import React, { Component } from 'react';
import {Button} from 'react-bootstrap';

/**
 * This component should display a welcome message to the user if registered
 * otherwise should display a button to register
 * 
 */
class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: undefined,
            name: ""
        }
    }

    async componentWillMount() {

        const user = this.props.user;
        let name = "";

        if(user) {
            name = await user.name(); 
        }

        this.setState({ name: this.props.web3.utils.toUtf8(name), user: user });
    }


    render() {

        if(!this.state.user) {
            // User not registered and/or still loading information
            return(
                <div>
                    Not registerd? Subscribe now!
                    {/* TODO Aggiungere bottone di iscrizione */}
                </div>
            );

        }
        else {

            return(
                <div>
                    <h2>Welcome back {this.state.name}!</h2>
                </div>
            );
    }
    }
}

export default Login;