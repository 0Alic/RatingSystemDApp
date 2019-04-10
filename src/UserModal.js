import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import BootstrapTable from 'react-bootstrap-table-next';


/**
 * This component is a modal showing the information concerning an user
 * 
 */
class UserModal extends React.Component {

    constructor(props) {
        super(props);

        this.columns = [{
            dataField: 'rated',
            text: 'Rated',
            headerStyle: (column, colIndex) => {
                return { width: '55%', textAlign: 'center' };
            },
        }, {
            dataField: 'score',
            text: 'Score',
            'width': "20%"
        }, {
            dataField: 'block',
            text: 'At block',
            'width': "20%" 
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
                            {data["name"] + "'s Profile"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Your items:</h4>
                        {data["items"].map(o => {
                                const name = o.name;
                                const address = o.address;
                                return (<p key={address}>{name}: {address}</p>);
                            })}
                        <h4>Items you rated:</h4>
                        <BootstrapTable keyField='block' data={ this.props.userTableData } columns={ this.columns } />
                    </Modal.Body>
                    <Modal.Footer>
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

export default UserModal;