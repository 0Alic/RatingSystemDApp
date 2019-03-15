import React from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ScoreRow from "./UiComponents/ScoreRow.js";
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import Computer from './Computer';

/**
 * This component should display the table of Item names
 * It should be in charge of get the information and flow it to the underlying components
 * The Item list is passed through props, they are contract instances
 * 
 * 
 * This solution is not optimal because if props.items is too big it may take too much.
 * 
 */
class TableOfContents extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          data: [],
          computer: undefined,
          loading: true,
          currentComputer: 0  // current formula to compute score
      };

      // Table columns
      this.columns = [ {
        dataField: 'address',
        text: 'Address',
        headerStyle: (column, colIndex) => {
          return { width: '50%', textAlign: 'center' };
        }
      }, {
        dataField: 'title',
        text: 'Title',
        'width': "20%"
      }, {
        dataField: 'score',
        text: 'Score',
        'width': "20%"
      }];

      this.handleComputerChange = this.handleComputerChange.bind(this);
      this.handleRowClick = this.handleRowClick.bind(this);
    }

    async componentWillMount() {

      this.update(0);
    }

    async update(computer) {

      const registry = this.props.registry;
      const items = this.props.items;
      const web3 = this.props.web3;

      // Retrieve RatingComputer instance
      const computerAddress = await registry.getComputer(computer);

      // Get Items info
      let p_titles = [];
      let p_scores = [];

      items.forEach((i) => {
          
        p_titles.push(i.name());
        p_scores.push(i.computeScore(computerAddress));
      });

      let titles = await Promise.all(p_titles); // Names in bytes32
      let scores = await Promise.all(p_scores); // Scores
      let data = []

      titles.forEach((t, i) => {

        let obj = {}
        obj["title"] = web3.utils.toUtf8(t);
        obj["address"] = items[i].address;
        obj["score"] = scores[i].toNumber();
        data.push(obj);
      });

      this.setState({ data: data, computer: computer, loading: false });
    }


    async handleComputerChange(e) {

      const computer = e.target.value;
      this.setState({ loading: true });
      this.update(computer);
    }

    handleRowClick(e) {
      console.log(e.target)
    }

    render() {

      return(
        <div>
          {/* Menu to select the current computaion formula */}
          <Row>
            <Col>
              <Computer
                registry={this.props.registry}
                web3={this.props.web3} 
                provider={this.props.provider}
                onComputerChange={this.handleComputerChange} />
            </Col>
          </Row>
          
          <BootstrapTable keyField='address' data={ this.state.data } columns={ this.columns } />

          {/* Table to show items */}
          {/* <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((el, index) => {
              // Questo sotto può essere un component "table row"?
              const n = el.name;
              const s = el.score;
              const a = el.address;
              return(
                <tr onClick={this.handleRowClick} value={"row"} key={a}>
                  <th value={"index"}>{index+1}</th>
                  <td value={"name"} href="#">{n}</td>
                  <ScoreRow data={s} loading={this.state.loading} />
                </tr>
              )              
            })}
           </tbody>
          </table> */}
        </div>
      );
    }
}

export default TableOfContents;