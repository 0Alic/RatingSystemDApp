import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

/**
 * This component implements the submission of a new rate. If the sender has no permissions,
 * this component will not be displayed.
 * 
 */
class AddRateForm extends Component {

    async addRate(event, item) {

        const user = this.props.user;
        const score = event.currentTarget.score.value;
        const account = this.props.account;
        
        event.preventDefault();
        await user.addRate(item, score, {from: account});
    }

    render() {

        if (this.props.display) {

            const item = this.props.item;
            return (
                <div>
                    <Form inline onSubmit={e => this.addRate(e, item)}>
                        <Form.Control id="score" as="select" className="mr-sm-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                                return (<option key={n} value={n}>{n}</option>);
                            })}
                        </Form.Control>
                        <Button type="submit">Leave a rating</Button>
                    </Form>
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    }
}

export default AddRateForm;