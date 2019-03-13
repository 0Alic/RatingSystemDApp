import React from "react";
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

      this.handleComputerChange = this.handleComputerChange.bind(this);
    }

    async componentWillMount() {

      this.update(0);
    }

    async update(computer) {

      // TODO modificare solo il parametrino dello scopre con "computing"
      const registry = this.props.registry;
      const items = this.props.items;
      const web3 = this.props.web3;

      // Retrieve RatingComputer instance
      const computerAddress = await registry.getComputer(computer);

      // Get Items info
      let p_names = [];
      let p_scores = [];

      items.forEach((i) => {
          
        p_names.push(i.name());
        p_scores.push(i.computeScore(computerAddress));
      });

      let names = await Promise.all(p_names); // Names in bytes32
      let scores = await Promise.all(p_scores); // Scores
      let data = []

      names.forEach((n, i) => {
        let obj = {}
        obj[web3.utils.toUtf8(n)] = scores[i].toNumber();
        data.push(obj);
      });

      this.setState({ data: data, computer: computer, loading: false });
    }


    async handleComputerChange(e) {

      const computer = e.target.value;
      this.update(computer);

      // // TODO modificare solo il parametrino dello scopre con "computing"
      // const registry = this.props.registry;
      // const items = this.props.items;
      // const web3 = this.props.web3;

      // // Retrieve RatingComputer instance
      // const computerAddress = await registry.getComputer(computer);

      // // Get Items info
      // let p_names = [];
      // let p_scores = [];

      // items.forEach((i) => {
          
      //   p_names.push(i.name());
      //   p_scores.push(i.computeScore(computerAddress));
      // });

      // let names = await Promise.all(p_names); // Names in bytes32
      // let scores = await Promise.all(p_scores); // Scores
      // let data = []

      // names.forEach((n, i) => {
      //   let obj = {}
      //   obj[web3.utils.toUtf8(n)] = scores[i].toNumber();
      //   data.push(obj);
      // });

      // this.setState({ data: data, computer: computer, loading: false });

      // // Computer is an intger >= 0
      // this.setState({currentComputer: computer});
    }

    render() {

      // if(this.state.computer != this.props.computer) {

      //   this.update();
      // }

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

          {/* Table to show items */}
          <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody >
            {this.state.data.map((el, index) => {
              // Titles are unique (?)
              // Questo sotto può essere un component "table row"?
              const k = Object.keys(el);
              const v = el[k];
              return(
                <tr key={k}>
                  <th>{index+1}</th>
                  <td>{k}</td>
                  <ScoreRow data={v} loading={this.state.loading} />
                </tr>
              )              
            })}
           </tbody>
          </table>
        </div>
      );
    }
}

export default TableOfContents;