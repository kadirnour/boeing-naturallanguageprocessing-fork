import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Popup modal to display badge information
class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false,
            relationship: "",
            color: "#000000"
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
        this.setState({color: event.target.value});
    }

    // Creates a new category with the given input name
    handleSubmit = () => {
        this.handleReset()
        this.props.type == "relationship" ?
            this.props.createRelationshipType(this.state.color, this.state.relationship)
            :
                this.props.type == "edit" ?
                    this.props.editRelationship(this.state.color, this.state.relationship)
                :   
                    this.props.createRelationship(this.state.color)
        this.handleClose();
    }

    handleReset = () => { // Resets options in popup modal
        
        this.setState({relationship: "",
                       color: "#000000"})
    }

    renderColorsOptions = (option) => {
        if (this.props.relationships.some(e => Object.values(e) == option.value)) {
            return null
        }
        else {
            return <option value={option.value}>{option.label}</option>
        }
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
                            <input type="color" value={this.color} onChange={this.handleChangeColor}></input>
                            <button onClick={() => this.handleSubmit()}>
                                Create
                            </button>
                        </Modal.Body>
                    </Modal>  
                </Fragment>  
                : 
                this.props.type == "edit" ?
                    <Fragment>  
                        <Modal show={this.props.showModalPopup} onHide={this.handleClose}
                            size="lg"  
                            aria-labelledby="contained-modal-title-vcenter"  
                            centered>  
                            <Modal.Header closeButton>  
                                <Modal.Title id="sign-in-title">  
                                    Edit relationship
                                </Modal.Title>  
                            </Modal.Header>  
                            <Modal.Body>  
                                <input type="string" placeholder="New relationship name..." onChange={this.handleChange}></input>
                                <input type="color" value={this.color} onChange={this.handleChangeColor}></input>
                                <button onClick={() => this.handleSubmit()}>
                                    Enter
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
                                    {this.props.relationships.map((option) => (
                                        <option value={Object.values(option)}>{Object.values(option)}</option> // Display current options from created relationships
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