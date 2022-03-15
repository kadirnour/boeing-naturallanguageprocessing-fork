import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPlusCircle, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'

/*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: 
Description:
Returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false,
            relationship: "", // Name of relationship
            color: "#000000" // Color of relationship
        };  
    }

    /*##################################################################################
                                        Modal Functions
    ###################################################################################*/
      

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
        this.props.onPopupClose(false, "", this.props.row);  
    }  


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleChange = (event) => {
        this.setState({relationship: event.target.value});
    }
    

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleChangeColor = (event) => {
        this.setState({color: event.target.value});
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleEditLoad = () => {
        this.setState({relationship: Object.keys(this.props.relationshipTypes[this.props.row]).toString(),
            color: Object.values(this.props.relationshipTypes[this.props.row]).toString()})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleCreateLoad = () => {
        this.setState({relationship: "",
            color: "#000000"})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleSubmit = () => {
        this.props.type == "newRelationshipType" ? // Creating a new relationship type
            this.props.createRelationshipType(this.state.color, this.state.relationship)
            :
            this.props.type == "editRelationshipType" ? // Editing an existing relationship type
                this.props.editRelationshipType(this.state.color, this.state.relationship)
                : // Creating a new relationship line between 2 nodes
                this.props.createRelationship(this.state.color, this.state.relationship)

        this.handleClose();
    }

    /*##################################################################################
                                    Relationship Functions
    ###################################################################################*/


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleChooseRelationship = (event) => {
        let color;
        for(let i = 0; i < this.props.relationshipTypes.length; i++) {
            if(Object.keys(this.props.relationshipTypes[i]) == event.target.value) {
                color = (Object.values(this.props.relationshipTypes[i])).toString()
            }
        }

        this.setState({relationship: event.target.value,
            color: color})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleDelete = () => {
        this.props.deleteRelationshipType()
        this.handleClose()
    }


    /*##################################################################################
                                        Table Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    renderTable = () => {
        const table = []
        for (let i = 0; i < Object.keys(this.props.nouns).length; i++){
            table.push(
                <tr key={i} className={"centered weight"}>
                    <td className="table-data">
                        {Object.keys(this.props.nouns)[i]}
                    </td>
                </tr>
            )
        }
        return table
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    render() {  
        return (  
            this.props.type == "nouns" ?
                <Fragment>  
                    <Modal show={this.props.showModalPopup} onHide={this.handleClose} onShow={this.handleCreateLoad}
                        size="lg"  
                        aria-labelledby="contained-modal-title-vcenter"  
                        centered>
                        <Modal.Header closeButton>  
                            <Modal.Title id="sign-in-title">  
                                {this.props.label}
                            </Modal.Title>  
                        </Modal.Header>  
                        <Modal.Body>  
                            <table className="table table-head">
                                <thead className="table-light">
                                    <tr>
                                        <th className="centered table-header">
                                            Nouns
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body--taxonomy">
                                    {this.props.nouns == null ?
                                        null 
                                        :
                                        this.renderTable()
                                    }
                                </tbody>
                            </table>
                        </Modal.Body>
                    </Modal>  
                </Fragment>  
                : 
                this.props.type == "newRelationshipType" ? // Creating a new relationship type
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
                                <div>
                                    <input type="string" size="95" value={this.state.relationship} placeholder="Enter a Relationship Name..." onChange={this.handleChange}/> 
                                </div> &nbsp;&nbsp;&nbsp;
                                <div>
                                    <h6>
                                        Choose a Color for the Relationship
                                    </h6>
                                    <input type="color" value={this.state.color} onChange={this.handleChangeColor}/> &nbsp;&nbsp;&nbsp;
                                </div> &nbsp;&nbsp;&nbsp;
                                <div>
                                    <button className="button__small blue" onClick={() => this.handleSubmit()}>
                                        <FontAwesomeIcon icon={faPlusCircle}/> &nbsp;
                                        Create
                                    </button>
                                </div>
                            </Modal.Body>
                        </Modal>  
                    </Fragment>  
                    : 
                    this.props.type == "editRelationshipType" ? // Editing a relationship type
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
                                    <div>
                                        <input type="string" size="95" value={this.state.relationship} placeholder="New relationship name..." onChange={this.handleChange}/> 
                                    </div> &nbsp;&nbsp;&nbsp;
                                    <div>
                                        <h6>
                                            Edit Color for the Relationship
                                        </h6>
                                        <input type="color" value={this.state.color} onChange={this.handleChangeColor}/>
                                    </div> &nbsp;&nbsp;&nbsp;
                                    <div>
                                        <button className="button__small blue" onClick={() => this.handleSubmit()}>
                                            <FontAwesomeIcon icon={faCheck}/> &nbsp;
                                            Enter
                                        </button> &nbsp;&nbsp;&nbsp;
                                        <button className="button__small red" onClick={() => this.handleDelete()}>
                                            <FontAwesomeIcon icon={faTrash}/> &nbsp;
                                            Delete
                                        </button>
                                    </div>
                                </Modal.Body>
                            </Modal>  
                        </Fragment>  
                        : // Creating a new relationship line between 2 nodes
                        <Fragment> 
                            <Modal show={this.props.showModalPopup} onHide={this.handleClose} 
                                size="lg"  
                                aria-labelledby="contained-modal-title-vcenter"  
                                centered>  
                                <Modal.Header closeButton>  
                                    <Modal.Title id="sign-in-title">  
                                        Create a New Relationship
                                    </Modal.Title>  
                                </Modal.Header>  
                                <Modal.Body>  
                                    <div>
                                        <select value={this.state.relationship} onChange={this.handleChooseRelationship}>
                                            {this.props.relationshipTypes.map((option) => (
                                                <option value={Object.keys(option)}>
                                                    {Object.keys(option)}
                                                </option>)) // Display current options from created relationshipTypes
                                            }
                                        </select>
                                    </div> &nbsp;&nbsp;&nbsp;
                                    <div>
                                        <button className="button__small blue" onClick={() => this.handleSubmit()}>
                                            <FontAwesomeIcon icon={faPlus}/> &nbsp;
                                            Create
                                        </button>
                                    </div>
                                </Modal.Body>
                            </Modal>  
                        </Fragment>  
        );  
    }  
}  
  
export default (ModalPopup);