import React, { Component } from 'react';
import {Button, Form, Col } from 'react-bootstrap';

/**
 * A simple aggregation of form Components.
 * Input Text + submit button
 * 
 */
class InputForm extends Component {

    render() {

        return (
            <Form onSubmit={e => this.props.onSubmit(e)}>
                <Form.Group>
                    <Form.Label>{this.props.label}</Form.Label>
                </Form.Group>
                <Form.Row>
                    <Col>
                        <Form.Control type="text" id={this.props.id} placeholder={this.props.placeholder} />
                    </Col>
                    <Col>
                        <Button type="submit">{this.props.buttonText}</Button>
                    </Col>
                </Form.Row>
            </Form>
        );
    }
}


export default InputForm;