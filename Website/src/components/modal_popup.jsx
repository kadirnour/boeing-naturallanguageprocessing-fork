import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'



/*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: 
Description:
Returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false};  
    }  


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    isShowModal = (status) => {  
        this.handleClose();  
        this.setState({showModal: status});  
    }  
    

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleClose = () => {  
        this.props.onPopupClose(false);  
    }  


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleChange = (event) => {
        this.setState({Category: event.target.value});
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleSubmit = () => {
        if (this.props.type=="confirm"){
            this.props.confirmSave()
            this.handleClose();
        }
        else if (Object.values(Object.keys(this.props.categories)).indexOf(this.state.Category) > -1) {
            console.log("Name already used")
        } else {
            this.props.createCategory(this.state.Category);
            this.handleClose();
        }
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    render() {  
        return ( 
            this.props.type == "confirm"? 
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
                    <button onClick={() => this.handleSubmit()}>
                        Yes!
                    </button>
                    <button onClick={() => this.handleClose()}>
                        No!
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