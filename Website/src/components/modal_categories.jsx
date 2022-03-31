import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false};  
    }  

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: isShowModal
    Description: opens or closes the modal
    Returns: sets in state the modal status
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    isShowModal = (status) => {  
        this.handleClose();  
        this.setState({showModal: status});  
    }  
    
    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: handleClose
    Description: closes the modal
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleClose = () => {  
        this.props.onPopupClose(false);  
    }  

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: handleChange
    Description: user types category name in input box
    Returns: sets category name in state
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleChange = (event) => {
        this.setState({Category: event.target.value});
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: handleSubmit
    Description: saves categories to .csv or creates a new category
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleSubmit = () => {
        if (this.props.type === "confirm"){ // confirmation to save to .csv
            this.props.confirmSave()
            this.handleClose();
        }
        else if (Object.values(Object.keys(this.props.categories)).indexOf(this.state.Category) > -1) { // category name has already been used
            console.log("Name already used")
            this.handleClose();
        } else { // creates a new category
            this.props.createCategory(this.state.Category);
            this.handleClose();
        }
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: render
    Description: renders popup modal for Categories page
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    render() {  
        return ( 
            this.props.type === "confirm"? // save confirmation (.csv)
            <Fragment>  
            <Modal show={this.props.showModalPopup} onHide={this.handleClose}
                size="lg"  
                aria-labelledby="contained-modal-title-vcenter"  
                centered>  
                <Modal.Header closeButton>  
                    <Modal.Title id="sign-in-title">  
                        Are you really double dog sure, you want save?
                     </Modal.Title>  
                </Modal.Header>  
                <Modal.Body>  
                    <button className="button__small blue" onClick={() => this.handleSubmit()}>
                        Yes!
                    </button> &nbsp;&nbsp;&nbsp;
                    <button className="button__small red" onClick={() => this.handleClose()}>
                        No!
                    </button>
                </Modal.Body>
            </Modal>  
        </Fragment>  
        : // create a new category
            <Fragment>  
                <Modal show={this.props.showModalPopup} onHide={this.handleClose}
                    size="lg"  
                    aria-labelledby="contained-modal-title-vcenter"  
                    centered>  
                    <Modal.Header closeButton>  
                        <Modal.Title id="sign-in-title">  
                            Create a new category
                         </Modal.Title>  
                    </Modal.Header>  
                    <Modal.Body>  
                        <input type="string" size="70" placeholder="Enter a Category Name..." onChange={this.handleChange}/> &nbsp;&nbsp;&nbsp;
                        <button className="button__small blue" onClick={() => this.handleSubmit()}>
                            <FontAwesomeIcon icon={faPlus}/> &nbsp;
                            Enter
                        </button>
                    </Modal.Body>
                </Modal>  
            </Fragment>  
        );  
    }  
}  
  
export default (ModalPopup);