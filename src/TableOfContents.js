import React from "react";
import { Table, Button } from 'react-bootstrap';

/**
 * Display the table of Item names
 * 
 * The Item list is passed through props, they are TruffleContract
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
          loading: true
      };
    }

    async update() {

      const registry = this.props.registry;
      const items = this.props.items;
      const web3 = this.props.web3;
      const computer = this.props.computer;

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

      this.setState({ data: data, computer: computer, loading: true });
    }

    render() {

      if(this.state.computer != this.props.computer)
        this.update();

      return(
        <div>
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
                  <td>{v}</td>
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