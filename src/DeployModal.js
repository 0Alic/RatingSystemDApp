import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

/**
 * This component shows the form to upload a new item
 * 
 */

class DeployModal extends React.Component {

    constructor(props) {
        super(props);
        this.i = 0; // to Suppress warning
        // TODO fare i bind dei listener tutti i component che non  lo fanno
    }

    async createItem(e) {

        e.preventDefault();

        const title = e.currentTarget.itemTitle.value;
        const user = this.props.user;
        const web3 = this.props.web3;
        const account = this.props.account;

        if(title === "") {
            alert("Blank game title");
            return;
        }

        if(title.length > 32) {
            alert("Game title too long");
            return;
        }

        // Deploy Item
        await user.createItem(web3.utils.fromUtf8(title), {from: account});
    }

    render() {

        if(true) {

            return (
                <Modal
                    onHide={this.props.onHide}
                    show={this.props.show}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered >
                    
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add a new board game to this list
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={e => this.createItem(e)}>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" id="itemTitle" placeholder="Write title here" />
                            </Form.Group>
                            <Button type="submit">Publish this game</Button>
                        </Form>
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

export default DeployModal;