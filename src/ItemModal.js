import React from "react";
import Button from 'react-bootstrap/Button';
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
                        <BootstrapTable keyField='block' data={ this.props.itemTableData } columns={ this.columns } />
                    </Modal.Body>
                    <Modal.Footer>
                        <AddRateForm display={data["permissions"].toNumber() === 0}
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

export default ItemModal;