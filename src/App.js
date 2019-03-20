import React, { Component } from 'react';
import logo from './logo.jpg';
import Navbar from 'react-bootstrap/Navbar';
import './App.css';
import RSF from './RSF.js';
import Container  from 'react-bootstrap/Container';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class App extends Component {

  submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    
    alert(form.elements.searchbar.value);
  }

  render() {

    return(
      <div>

        {/* Continua */}
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
            <Form inline onSubmit={e => this.submit(e)}>
              <FormControl id="searchbar" type="text" placeholder="Search by address" className="mr-sm-2" />
              <Button variant="outline-light" type="submit">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>      

        <Container className="App">
          {/* Title Header */}
          <Row>
              <Col>
                  <h1>Boarderline</h1>
                  <h3>Board games recommended by board gamers</h3>
              </Col>
          </Row>

          {/* Here listing the information provided by Web3 */}
          <RSF />

        </Container>
  
      </div>
    );
  }
}


export default App;
