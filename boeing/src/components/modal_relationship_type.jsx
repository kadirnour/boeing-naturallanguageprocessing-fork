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

    // componentDidMount = () => { // If there is a relationship made already, make the first option the default choice
    //     if(this.props.relationships.length != 0) {
    //         this.setState({relationship: (Object.keys(this.props.relationships[0]).toString()),
    //                        color: (Object.values(this.props.relationships[0]).toString())
    //                      })
    //     }
    // }
      
    isShowModal = (status) => {  
        this.handleClose();  
        this.setState({ showModal: status});  
    }  
  
    handleClose = () => {  
        //this.componentDidMount() // Resets options in popup modal
        this.props.onPopupClose(false);  
    }  

    handleChange = (event) => {
        this.setState({relationship: event.target.value});
    }
    
    handleChangeColor = (event) => {
        this.setState({color: event.target.value});
    }

    handleChangeRelationship = (event) => {
        let color;
        for(let i = 0; i < this.props.relationships.length; i++) {
            if(Object.keys(this.props.relationships[i]) == event.target.value) {
                color = (Object.values(this.props.relationships[i])).toString()
            }
        }

        this.setState({relationship: event.target.value,
                       color: color})
    }

    handleDelete = () => {
        this.props.deleteRelationship()
        this.handleClose()
    }

    handleEditLoad = () => {
        this.setState({relationship: Object.keys(this.props.relationships[this.props.row]),
                       color: Object.values(this.props.relationships[this.props.row])})
    }

    handleCreateLoad = () => {
        this.setState({relationship: "",
                       color: "#000000"})
    }

    // Creates a new category with the given input name
    handleSubmit = () => {
        this.props.type == "relationship" ? // Creating a new relationship type
            this.props.createRelationshipType(this.state.color, this.state.relationship)
            :
                this.props.type == "edit" ? // Editing an existing relationship
                    this.props.editRelationship(this.state.color, this.state.relationship) // !! Right now this uses name of relationship, might want to create a id and use that instead !!
                : // Creating a new relationship between two nodes
                    this.props.createRelationship(this.state.color, this.state.relationship)
        this.handleClose();
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

            this.props.type == "relationship" ? // Creating a new relationship type and setting a color
                <Fragment>  
                    <Modal show={this.props.showModalPopup} onHide={this.handleClose} onShow={this.handleCreateLoad}
                        size="lg"  
                        aria-labelledby="contained-modal-title-vcenter"  
                        centered>  
                        <Modal.Header closeButton>  
                            <Modal.Title id="sign-in-title">  
                                Create a new relationship type
                            </Modal.Title>  
                        </Modal.Header>  
                        <Modal.Body>  
                            <input type="string" value={this.state.relationship} placeholder="New relationship name..." onChange={this.handleChange}></input>
                            <input type="color" value={this.state.color} onChange={this.handleChangeColor}></input>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button onClick={() => this.handleSubmit()}>
                                Create
                            </button>
                        </Modal.Body>
                    </Modal>  
                </Fragment>  
                : 
                this.props.type == "edit" ? // Editing a current relationship and changing the name and color
                    <Fragment>   
                        <Modal show={this.props.showModalPopup} onHide={this.handleClose} onShow={this.handleEditLoad}
                            size="lg"  
                            aria-labelledby="contained-modal-title-vcenter"  
                            centered>  
                            <Modal.Header closeButton>  
                                <Modal.Title id="sign-in-title">  
                                    Edit relationship
                                </Modal.Title>  
                            </Modal.Header>
                            <Modal.Body>  
                                <input type="string" value={this.state.relationship} placeholder="New relationship name..." onChange={this.handleChange}></input>
                                <input type="color" value={this.state.color} onChange={this.handleChangeColor}></input>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={() => this.handleSubmit()}>
                                    Enter
                                </button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={() => this.handleDelete()}>
                                    Delete
                                </button>
                            </Modal.Body>
                        </Modal>  
                    </Fragment>  
                    : // Creating a new relationship between two nodes
                    <Fragment> 
                        <Modal show={this.props.showModalPopup} onHide={this.handleClose} 
                            size="lg"  
                            aria-labelledby="contained-modal-title-vcenter"  
                            centered>  
                            <Modal.Header closeButton>  
                                <Modal.Title id="sign-in-title">  
                                    Choose relationship
                                </Modal.Title>  
                            </Modal.Header>  
                            <Modal.Body>  
                                <select value={this.state.relationship} onChange={this.handleChangeRelationship}>
                                    {this.props.relationships.map((option) => (
                                        <option value={Object.keys(option)}>{Object.keys(option)}</option> // Display current options from created relationships
                                    ))}
                                </select>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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