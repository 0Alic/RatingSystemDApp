import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form';
import {Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';


/**
 * This component is a modal showing the information concerning an user
 * 
 */
class UserModal extends React.Component {

    constructor(props) {
        super(props);

        this.columns = [{
            dataField: 'rated',
            text: 'Rated',
            headerStyle: (column, colIndex) => {
                return { width: '55%', textAlign: 'center' };
            },
        }, {
            dataField: 'score',
            text: 'Score',
            'width': "20%"
        }, {
            dataField: 'block',
            text: 'At block',
            'width': "20%" 
        }];        
    }

    async grantPermission(e, address) {

        e.preventDefault();

        const destUser = e.currentTarget[address].value;

        if(destUser === "") {
            alert("Empty field");
            return;
        }

        const account = this.props.account;
        const itemContract = this.props.itemContract;
        const item = await itemContract.at(address);
        await item.grantPermission(destUser, {from: account});
    }
    
    render() {

        let data = this.props.data;

        if(data) {

            return (
                <Modal
                    onHide={this.props.onHide}
                    show={this.props.show}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered >
                    
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {data["name"] + "'s Profile"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2>Your items:</h2>
                        {data["items"].map(o => {
                                const name = o.name;
                                const address = o.address;
                                return (
                                    <div key={address}>
                                    <Form onSubmit={e => this.grantPermission(e, address)}>
                                        <Form.Group>
                                            <Form.Label><h4>{name}</h4> {address}</Form.Label>
                                        </Form.Group>
                                        <Form.Row>
                                            <Col>
                                                <Form.Control type="text" id={address} placeholder="Type the address of user here" />
                                            </Col>
                                            <Col>
                                                <Button type="submit">Grant Permissions to</Button>
                                            </Col>
                                        </Form.Row>
                                    </Form>
                                    <hr/>
                                    </div>
                                );
                            })}
                        <h4>Items you rated:</h4>
                        <BootstrapTable keyField='block' data={ this.props.userTableData } columns={ this.columns } />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        else
            return (
                <Modal onHide={this.props.onHide}
                        show={this.props.show}>
                    Information not found
                </Modal>
            ); 
    }
}

export default UserModal;