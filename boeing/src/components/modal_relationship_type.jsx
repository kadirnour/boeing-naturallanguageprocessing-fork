import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const options = [
    {
      label: "Red",
      value: "Red",
    },
    {
      label: "Blue",
      value: "Blue",
    },
    {
      label: "Green",
      value: "Green",
    },
    {
      label: "Purple",
      value: "Purple",
    },
    {
      label: "Yellow",
      value: "Yellow",
    },
  ];

// Popup modal to display badge information
class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false,
            relationship: "",
            color: "Red"
        };  
    }  
  
    isShowModal = (status) => {  
        this.handleClose();  
        this.setState({ showModal: status});  
    }  
  
    handleClose = () => {  
        this.props.onPopupClose(false);  
    }  

    handleChange = (event) => {
        this.setState({relationship: event.target.value});
    }
    
    handleChangeColor = (event) => {
        this.setState({color: event.target.value, });
    }

    // Creates a new category with the given input name
    handleSubmit = () => {
        this.props.type == "relationship" ?
            this.props.createRelationshipType(this.state.color, this.state.relationship)
            :
            this.props.createRelationship(this.state.color)
        this.handleClose();
    }
  
    render() {  
        return (  

            this.props.type == "relationship" ?
                <Fragment>  
                    <Modal show={this.props.showModalPopup} onHide={this.handleClose}
                        size="lg"  
                        aria-labelledby="contained-modal-title-vcenter"  
                        centered>  
                        <Modal.Header closeButton>  
                            <Modal.Title id="sign-in-title">  
                                Create a new relationship type
                            </Modal.Title>  
                        </Modal.Header>  
                        <Modal.Body>  
                            <input type="string" placeholder="New relationship name..." onChange={this.handleChange}></input>
                            {/* <input type="string" placeholder="New relationship color..." onChange={this.handleChange}></input> */}
                            <select value={this.state.color} onChange={this.handleChangeColor}>
                                {options.map((option) => (
                                    <option value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <button onClick={() => this.handleSubmit()}>
                                Create
                            </button>
                        </Modal.Body>
                    </Modal>  
                </Fragment>  
                : 
                <Fragment>  
                    <Modal show={this.props.showModalPopup} onHide={this.handleClose}
                        size="lg"  
                        aria-labelledby="contained-modal-title-vcenter"  
                        centered>  
                        <Modal.Header closeButton>  
                            <Modal.Title id="sign-in-title">  
                                Choose relationship color
                            </Modal.Title>  
                        </Modal.Header>  
                        <Modal.Body>  
                            <select value={this.state.color} onChange={this.handleChangeColor}>
                                {options.map((option) => (
                                    <option value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <button onClick={() => this.handleSubmit()}>
                                Select
                            </button>
                        </Modal.Body>
                    </Modal>  
                </Fragment>  
    
        );  
    }  
}  
  
export default (ModalPopup);