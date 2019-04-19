import React from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';
import Computer from './Computer';

/**
 * This component should display the table of Users
 */
class TableOfContents extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          data: [],
          loading: true,
      };

      // Table columns
      this.columns = [ {
        dataField: 'address',
        text: 'User Address',
        headerStyle: (column, colIndex) => {
          return { width: '50%', textAlign: 'center' };
        }
      }, {
        dataField: 'name',
        text: 'Username',
        'width': "20%"
      }, {
        dataField: 'itemcount',
        text: 'Owner of',
        'width': "20%"
      }];
    }

    async componentWillMount() {

        const users = this.props.users;
        const web3 = this.props.web3;
        let names = [];
        let itemCounts = [];
        let data = [];

        users.forEach(u => {
            names.push(u.name());
            itemCounts.push(u.itemCount());

            let obj = {};
            obj["address"] = u.address;
            data.push(obj);
        });

        names = await Promise.all(names);
        itemCounts = await Promise.all(itemCounts);

        data.forEach((obj, i) => {
            obj["name"] = web3.utils.toUtf8(names[i]);
            obj["itemcount"] = itemCounts[i] + " games";
        });
  
        this.setState({ data: data });
    }

    render() {

      return(
        <div>
          <h2>Boarderliners</h2>
          <BootstrapTable keyField='address' data={ this.state.data } columns={ this.columns } />
        </div>
      );
    }
}

export default TableOfContents;