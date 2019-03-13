import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import RSF from './RSF.js';
import Container  from 'react-bootstrap/Container';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';

class App extends Component {

  render() {

    return(
      <div>
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
