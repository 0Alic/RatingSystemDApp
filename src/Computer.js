import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import TruffleContract from 'truffle-contract';
import ComputerRegistry from './build/contracts/ComputerRegistry.json'
import RatingComputer from './build/contracts/RatingComputer.json'
import Form from 'react-bootstrap/Form';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';


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

        this.handleClick = this.handleClick.bind(this);
    }

    async componentWillMount() {

        const rsf = this.props.rsf;
        const web3 = this.props.web3;

        // Get ComputerRegistry instance
        const registryAddress = await rsf.computerRegistry();
        const registry = await this.registryContract.at(registryAddress);

        let ids = await registry.getIds();
        this.setState({computers: ids.map(id => {
            return web3.utils.toUtf8(id);
        })});
    }

    handleClick(e) {
        e.preventDefault();
        this.props.parent.setComputer(e.target.value);
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
                                <Form.Control as="select" onChange={this.handleClick}>
                                    {this.state.computers.map((c, index) => {
                                        return(
                                            <option key={index} 
                                                    value={index}>{c}</option>
                                        );
                                    })}
                                    <option key={10} value={10}>Finto computer</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Button onClick={this.handleClick}>Update</Button> {/* Questo Bottone triggererà il refresh degli scores */}
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