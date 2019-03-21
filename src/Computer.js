import React, { Component } from 'react';
import TruffleContract from 'truffle-contract';
import ComputerRegistry from './build/contracts/ComputerRegistry.json'
import RatingComputer from './build/contracts/RatingComputer.json'
import Form from 'react-bootstrap/Form';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';

/**
 * This component is in charge to let the user select the score
 * computation formula.
 * 
 */
class Computer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            computers: undefined
        }

        const provider = this.props.provider;

        // Create Registry abstraction
        this.registryContract = TruffleContract(ComputerRegistry);
        this.registryContract.setProvider(provider);

        // Create RatingComputer abstraction
        this.computerContract = TruffleContract(RatingComputer);
        this.computerContract.setProvider(provider);
    }

    async componentWillMount() {

        const registry = this.props.registry;
        const web3 = this.props.web3;

        let ids = await registry.getIds();
        this.setState({computers: ids.map(id => {
            return web3.utils.toUtf8(id);
        })});
    }


    render() {

        if(this.state.computers) {

            return(
                <div>

                    <Row>
                        <Col>
                            <Form.Label>Select your score computation formula</Form.Label>
                        </Col>
                        <Col>
                            <Form.Group id="computerSelector">
                                <Form.Control as="select" onChange={this.props.onComputerChange}>
                                    {this.state.computers.map((c, index) => {
                                        return(
                                            <option key={index} 
                                                    value={index}>{c}</option>
                                        );
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </div>
            );
        }
        else {
            return(
                <div></div>
            );
        }
    }
}

export default Computer;