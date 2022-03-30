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
            edge: "", // Name of relationship
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
        this.setState({edge: event.target.value});
    }
    

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleChangeEdgeColor = (event) => {
        this.setState({color: event.target.value});
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleEditLoad = () => {
        this.setState({edge: Object.keys(this.props.edgeTypes[this.props.row]).toString(),
            color: Object.values(this.props.edgeTypes[this.props.row]).toString()})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleCreateLoad = () => {
        this.setState({edge: "",
            color: "#000000"})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleSubmit = () => {
        this.props.type=="confirm" ?
            this.props.confirmSave():
        this.props.type == "createNewEdgeType" ? // Creating a new relationship type
            this.props.createEdgeType(this.state.color, this.state.edge)
            :
            this.props.type == "editEdgeType" ? // Editing an existing relationship type
                this.props.editEdgeType(this.state.color, this.state.edge)
                : // Creating a new relationship line between 2 nodes
                this.props.createEdge(this.state.color, this.state.edge)

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
    handleChooseEdge = (event) => {
        let color;
        for(let i = 0; i < this.props.edgeTypes.length; i++) {
            if(Object.keys(this.props.edgeTypes[i]) == event.target.value) {
                color = (Object.values(this.props.edgeTypes[i])).toString()
            }
        }

        this.setState({edge: event.target.value,
            color: color})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleDeleteEdge = () => {
        this.props.deleteEdgeType()
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
                            <button className="button__small blue" onClick={() => this.handleSubmit()}>
                                Yes!
                            </button> &nbsp;&nbsp;&nbsp;
                            <button className="button__small red" onClick={() => this.handleClose()}>
                                No!
                            </button>
                        </Modal.Body>
                    </Modal>  
                </Fragment>
                :
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
                    this.props.type == "createNewEdgeType" ? // Creating a new relationship type
                        <Fragment>  
                            <Modal show={this.props.showModalPopup} onHide={this.handleClose} onShow={this.handleCreateLoad}
                                size="lg"  
                                aria-labelledby="contained-modal-title-vcenter"  
                                centered>  
                                <Modal.Header closeButton>  
                                    <Modal.Title id="sign-in-title">  
                                        Create a new edge type
                                    </Modal.Title>  
                                </Modal.Header>  
                                <Modal.Body>  
                                <div>
                                    <input type="string" size="95" value={this.state.edge} placeholder="Enter a Relationship Name..." onChange={this.handleChange}/> 
                                </div> &nbsp;&nbsp;&nbsp;
                                <div>
                                    <h6>
                                        Choose a color for the edge
                                    </h6>
                                    <input type="color" value={this.state.color} onChange={this.handleChangeEdgeColor}/> &nbsp;&nbsp;&nbsp;
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
                         : // Creating a new relationship line between 2 nodes
                        this.props.type == "createNewEdge" ?
                         <Fragment> 
                             <Modal show={this.props.showModalPopup} onHide={this.handleClose}
                                 size="lg"  
                                 aria-labelledby="contained-modal-title-vcenter"  
                                 centered>  
                                <Modal.Header closeButton>  
                                    <Modal.Title id="sign-in-title">  
                                        Create a new edge
                                    </Modal.Title>  
                                </Modal.Header>  
                                <Modal.Body>  
                                    <div>
                                        <select value={this.state.edge} onChange={this.handleChooseEdge}>
                                            {this.props.edgeTypes.map((option) => (
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
                        : 
                        this.props.type == "editEdgeType" ? // Editing a relationship type
                            <Fragment>   
                                <Modal show={this.props.showModalPopup} onHide={this.handleClose} onShow={this.handleEditLoad}
                                    size="lg"  
                                    aria-labelledby="contained-modal-title-vcenter"  
                                    centered>  
                                    <Modal.Header closeButton>  
                                        <Modal.Title id="sign-in-title">  
                                            Edit edge
                                        </Modal.Title>  
                                    </Modal.Header>
                                    <Modal.Body>  
                                        <div>
                                            <input type="string" size="95" value={this.state.edge} placeholder="New edge name..." onChange={this.handleChange}/> 
                                        </div> &nbsp;&nbsp;&nbsp;
                                        <div>
                                            <h6>
                                                Edit color for the edge
                                            </h6>
                                            <input type="color" value={this.state.color} onChange={this.handleChangeEdgeColor}/>
                                    </div> &nbsp;&nbsp;&nbsp;
                                        <div>
                                            <button className="button__small blue" onClick={() => this.handleSubmit()}>
                                                <FontAwesomeIcon icon={faCheck}/> &nbsp;
                                                Enter
                                        </button> &nbsp;&nbsp;&nbsp;
                                            <button className="button__small red" onClick={() => this.handleDeleteEdge()}>
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
                                            Choose edge
                                        </Modal.Title>  
                                    </Modal.Header>  
                                    <Modal.Body>  
                                        <select value={this.state.edge} onChange={this.handleChooseEdge}>
                                            {this.props.edgeTypes.map((option) => (
                                                <option value={Object.keys(option)}>
                                                    {Object.keys(option)}
                                                </option>)) // Display current options from created relationshipTypes
                                            }
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