import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  

class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {  
            showModal: false,
            relationship: "", // Name of relationship
            color: "#000000" // Color of relationship
        };  
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                       Modal Popup Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      
    isShowModal = (status) => {  
        this.handleClose();  
        this.setState({ showModal: status});  
    }  
  
    handleClose = () => {  
        this.props.onPopupClose(false);  
    }  

    // Updates state when user changes name
    handleChange = (event) => {
        this.setState({relationship: event.target.value});
    }
    
    // Updates state when user changes color
    handleChangeColor = (event) => {
        this.setState({color: event.target.value});
    }

    // Displays the currently selected relationship type when editing
    handleEditLoad = () => {
        this.setState({relationship: Object.keys(this.props.relationshipTypes[this.props.row]),
                    color: Object.values(this.props.relationshipTypes[this.props.row])})
    }

    // Displays the default values when creating a new relationship type
    handleCreateLoad = () => {
        this.setState({relationship: "",
                       color: "#000000"})
    }

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

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                       Relationship Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Updates state when user selects a relationship between 2 nodes
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

    // Deletes a relationship type
    handleDelete = () => {
        this.props.deleteRelationshipType()
        this.handleClose()
    }

    renderTable = () => {
        const table = []
        for (let i = 0; i < Object.keys(this.props.nouns).length; i++){
            table.push(
                <tr key={i} className={"centered weight"}>
                    <td>{Object.keys(this.props.nouns)[i]}</td>
                </tr>
            )
        }
        return table
    }

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
                            <table className="table table-hover tableBody t1">
                                <thead className="table-light">
                                    <tr>
                                        <th className="cell-align-middle centered tableHeader">
                                            Nouns
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
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
                                <input type="string" value={this.state.relationship} placeholder="New relationship name..." onChange={this.handleChange}/>
                                <input type="color" value={this.state.color} onChange={this.handleChangeColor}/>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={() => this.handleSubmit()}>
                                    Create
                                </button>
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
                                    <input type="string" value={this.state.relationship} placeholder="New relationship name..." onChange={this.handleChange}/>
                                    <input type="color" value={this.state.color} onChange={this.handleChangeColor}/>
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
                        : // Creating a new relationship line between 2 nodes
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
                                    <select value={this.state.relationship} onChange={this.handleChooseRelationship}>
                                        {this.props.relationshipTypes.map((option) => (
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