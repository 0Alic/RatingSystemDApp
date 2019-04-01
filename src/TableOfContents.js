import React from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
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
      }, {
        dataField: 'permission',
        text: 'You can rate it',
        'width': "20%"
      }, {
        dataField: 'deadline',
        text: 'For more blocks',
        'width': "20%"
      }];

      this.permissionMap = { 0: "Yes", 1: "No", 2: "Out of date"};
    
      this.handleComputerChange = this.handleComputerChange.bind(this);
    }

    async componentWillMount() {

      this.update(0);
    }

    async update(computer) {

      const registry = this.props.registry;
      const items = this.props.items;
      const web3 = this.props.web3;
      const userContract = this.props.userContract;
      const user = this.props.user;

      // Retrieve RatingComputer instance
      let computerAddress;
      let block;
      [computerAddress, block] = await Promise.all([registry.getComputer(computer),
                                                        web3.eth.getBlockNumber()] );

      // Get Items info
        // Promise arrays
      let p_titles = [];
      let p_scores = [];
      let p_permissions = [];
      let p_policies = [];

      items.forEach((i) => {
          
        p_titles.push(i.name());
        p_scores.push(i.computeScore(computerAddress));
        p_permissions.push(i.checkForPermission(user.address));
        p_policies.push(i.getPolicy(user.address));
      });

        // Arrays with results
      let titles = await Promise.all(p_titles); // Names in bytes32
      let scores = await Promise.all(p_scores); // Scores
      let permissions = await Promise.all(p_permissions); // 0 yes, 1 no, 2 out of date
      let policies = await Promise.all(p_policies); // granted yes/no + deadline

      // Build table object
      let data = []

      titles.forEach((t, i) => {

        let obj = {}
        let p = permissions[i].toNumber();
        let elapse = policies[i]._deadline.toNumber() - block;

        obj["title"] = web3.utils.toUtf8(t);
        obj["address"] = items[i].address;
        obj["score"] = scores[i].toNumber();
        obj["permission"] = this.permissionMap[p];

        if(p === 0) obj["deadline"] = elapse;
        else obj["deadline"] = "";

        data.push(obj);
      });

      this.setState({ data: data, computer: computer, loading: false });
    }


    async handleComputerChange(e) {

      const computer = e.target.value;
      this.setState({ loading: true });
      this.update(computer);
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
          
          <hr />          
          <h2>Available games</h2>
          <BootstrapTable keyField='address' data={ this.state.data } columns={ this.columns } />
        </div>
      );
    }
}

export default TableOfContents;