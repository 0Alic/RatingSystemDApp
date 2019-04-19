import React from "react";
import logo from './logo.jpg';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import ItemModal from './ItemModal.js';
import UserModal from './UserModal.js';
import DeployModal from './DeployModal.js';


/**
 * This component looks up for an item, given its address, and displays the
 * item information
 * 
 */
class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
                        userModalShow: false,
                        itemModalShow: false, 
                        userModalData: undefined,
                        itemModalData: undefined,
                        userTableData: undefined,
                        itemTableData: undefined,
                        deployModalShow: false,
                        deployModalData: undefined };
    }

    async viewProfile(e) {

        e.preventDefault();
        
        // Load user information
        const user = this.props.user;
        const web3 = this.props.web3;
        const itemContract = this.props.itemContract;

        let data = {}
        let promises = []
        let ratings = []
        let userTableData = [];
        let itemsAddr = [];
        let items = [];
        let itemName = [];

        promises.push(user.name());
        promises.push(user.getItems());
        promises.push(user.getAllRatings());

        [data["name"], itemsAddr, ratings] = await Promise.all(promises);
        data["name"] = web3.utils.toUtf8(data["name"]);

        // Load item data
        itemsAddr.forEach(address => {
            items.push(itemContract.at(address));
        });
        
        items = await Promise.all(items);

        data["items"] = [];
        items.forEach(item => {
            itemName.push(item.name());
        });

        itemName = await Promise.all(itemName);

        itemName.forEach((n, i) => {
            data["items"].push({name: web3.utils.toUtf8(n),
                address: items[i].address});
        });

        ratings._scores.forEach((s, i) => {
            let o = {};
            o["rated"] = ratings._rated[i];
            o["score"] = s.toNumber();
            o["block"] = ratings._blocks[i].toNumber();
            userTableData.push(o);
        });

        this.setState({ userModalShow: true, userModalData: data, userTableData: userTableData });
    }


    async deployItem(e) {

        e.preventDefault();

        this.setState({ deployModalShow: true, deployModalData: 11111 });
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
            let itemTableData = [];

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
                itemTableData.push(o);
            });

            this.setState({ itemModalShow: true, itemModalData: data, itemTableData: itemTableData });
        }
        catch(e) {
            console.log(e)
            alert("Invalid address");
        }
    }

    render() {

        // Functions to close the modals
        let itemModalClose = () => this.setState({ 
            itemModalShow: false, 
            itemModalData: undefined,
            itemTableData: undefined
        });
        let userModalClose = () => this.setState({ 
            userModalShow: false, 
            userModalData: undefined,
            userTableData: undefined
        });
        let deployModalClose = () => this.setState({
            deployModalShow: false,
            deployModalData: undefined,
        });
    
        let userModal, deployModal;
        let userLink, deployLink;

        if(this.props.user) {
            // If user is registered, show modals
            userModal = <UserModal show={this.state.userModalShow}
                            onHide={userModalClose} 
                            itemContract={this.props.itemContract}
                            account={this.props.account}
                            user={this.props.user}
                            data={this.state.userModalData}
                            userTableData={this.state.userTableData}
                        />;

            deployModal = <DeployModal 
                            show={this.state.deployModalShow}
                            onHide={deployModalClose}
                            user={this.props.user}
                            account={this.props.account}
                            web3={this.props.web3}
                        />;

            // And links
            userLink = <Nav.Link onClick={e => this.viewProfile(e)} variant="outline-light">Personal Area</Nav.Link>;
            deployLink = <Nav.Link onClick={e => this.deployItem(e)} variant="outline-light">Add a game to the inventory</Nav.Link>;
        }

        return (
            <div>
                {/* Image + title */}
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>
                        <img
                            alt=""
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />
                        {' Boarderline '}
                    </Navbar.Brand>

                    {/* <Router> */}
                        {/* Render a Router where the app contains routes */}
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                {userLink}
                                {deployLink}
                            </Nav>
                            {/* TODO FAI MEGLIO QUESTO */}
                            {/* <Route path="/userArea" component={Prova}></Route>  */}
                        </Navbar.Collapse>
                    {/* </Router> */}

                    {/* Search item */}
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Form inline onSubmit={e => this.searchItem(e)}>
                            <FormControl id="textbar" type="text" placeholder="Search item by address" className="mr-sm-2" />
                            <Button variant="outline-light" type="submit">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>

                <ItemModal show={this.state.itemModalShow}
                            onHide={itemModalClose}
                            data={this.state.itemModalData}
                            itemTableData={this.state.itemTableData}
                            user={this.props.user}
                            account={this.props.account}
                />

                {userModal}

                {deployModal}

            </div>
        );
    }
}

export default SearchBar;