import React from "react";
import logo from './logo.jpg';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal'

class ItemModal extends React.Component {

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered >
                
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Modal heading
              </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Centered Modal</h4>
                    <p>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                        dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
                        ac consectetur ac, vestibulum at eros.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = { modalShow: false };
    }

    async searchItem(e) {

        e.preventDefault();
        const form = e.currentTarget;
        const address = form.textbar.value;
        const itemContract = this.props.itemContract;        

        if(address === "") {
            alert("Empty field");
            return;
        }

        try {

            const item = await itemContract.at(address);
            // Load item data and set state
            let promises;

            promises.push(item.name());
            promises.push(item.owner());
            promises.push(item.name());
            
            this.setState({ modalShow: true });
        }
        catch(e) {
            alert("Invalid address");
        }

    }

    render() {

        let modalClose = () => this.setState({ modalShow: false });

        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        {' Boarderline '}
                    </Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Form inline onSubmit={e => this.searchItem(e)}>
                            <FormControl id="textbar" type="text" placeholder="Search by address" className="mr-sm-2" />
                            <Button variant="outline-light" type="submit">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>

                <ItemModal show={this.state.modalShow}
                            onHide={modalClose}
                />
            </div>
        );
    }
}

export default SearchBar;