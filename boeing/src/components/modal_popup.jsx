import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Popup modal to display badge information
class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false  
        };  
    }  
  
    isShowModal = (status) => {  
        this.handleClose();  
        this.setState({ showModal: status });  
    }  
  
    handleClose = () => {  
        this.props.onPopupClose(false);  
    }  

    handleChange = (event) => {
        this.setState({Category: event.target.value});
    }

    // Creates a new category with the given input name
    handleSubmit = () => {
        if (Object.values(Object.keys(this.props.categories)).indexOf(this.state.Category) > -1) {
            console.log("Name already used")
        } else {
            let name = {Category: this.state.Category}
            this.props.createCategory(name);
            this.handleClose();
        }
    }
  
    render() {  
        return (  
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
                        <input type="string" placeholder="New category name..." onChange={this.handleChange}></input>
                        <button onClick={() => this.handleSubmit()}>
                            Submit
                        </button>
                    </Modal.Body>
                </Modal>  
            </Fragment>  
        );  
    }  
}  
  
export default (ModalPopup);