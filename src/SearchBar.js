import React from "react";
import logo from './logo.jpg';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Modal from 'react-bootstrap/Modal'
import BootstrapTable from 'react-bootstrap-table-next';
import AddRateForm from './AddRateForm.js';

/**
 * This component is a modal showing the information concerning an item
 * 
 */
class ItemModal extends React.Component {

    constructor(props) {
        super(props);

        this.columns = [{
            dataField: 'score',
            text: 'Score',
            'width': "20%"
        }, {
            dataField: 'block',
            text: 'At block',
            'width': "20%"
        }, {
            dataField: 'rater',
            text: 'Rater',
            headerStyle: (column, colIndex) => {
                return { width: '50%', textAlign: 'center' };
            }
        }];        
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
                            {data["name"]}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Owner: {data["owner"]}</h4>
                        <h4>Rating table:</h4>
                        <BootstrapTable keyField='block' data={ this.props.tableData } columns={ this.columns } />
                    </Modal.Body>
                    <Modal.Footer>
                        <AddRateForm display={data["permissions"] === 0}
                                        item={data["address"]}
                                        account={this.props.account}
                                        user={this.props.user} />
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


/**
 * This component looks up for an item, given its address, and displays the
 * item information
 * 
 */
class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = { modalShow: false, 
                        modalData: undefined,
                        tableData: undefined };
    }

    async searchItem(e) {

        e.preventDefault();
        const form = e.currentTarget;
        const address = form.textbar.value;
        const user = this.props.user;
        const itemContract = this.props.itemContract;

        if(address === "") {
            alert("Empty field");
            return;
        }

        try {

            const item = await itemContract.at(address);
            const web3 = this.props.web3;

            // Load item data and set state
            let promises = [];
            let data = {};
            let ratings = [];
            let tableData = [];

            promises.push(item.owner());
            promises.push(item.name());
            promises.push(item.getAllRatings());
            promises.push(item.checkForPermission(user.address));
            
            [data["owner"], data["name"], ratings, data["permissions"]] = await Promise.all(promises);
        
            data["name"] = web3.utils.toUtf8(data["name"]);
            data["address"] = address;

            ratings._scores.forEach((s, i) => {
                let o = {};
                o["score"] = s.toNumber();
                o["block"] = ratings._blocks[i].toNumber();
                o["rater"] = ratings._raters[i];
                tableData.push(o);
            });

            this.setState({ modalShow: true, modalData: data, tableData: tableData });
        }
        catch(e) {
            console.log(e)
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
                            <FormControl id="textbar" type="text" placeholder="Search item by address" className="mr-sm-2" />
                            <Button variant="outline-light" type="submit">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>

                <ItemModal show={this.state.modalShow}
                            onHide={modalClose}
                            data={this.state.modalData}
                            tableData={this.state.tableData}
                            user={this.props.user}
                            account={this.props.account}
                />
            </div>
        );
    }
}

export default SearchBar;