import React, { Component, Fragment } from 'react';  
import { Modal } from 'react-bootstrap';  

class ModalPopup extends Component {  
    constructor(props) {  
        super(props);  
        this.state = {showModal: false};  
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                       Modal Popup Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
    handleClose = () => {  
        this.props.onPopupClose(false);  
    }  

    renderTable = () => {
        const table = []
        for (let r = 0; r < this.props.sentences['context'].length; r++) {
            for (let t = 0; t<this.props.sentences['context'][r][1].length; t++){
                table.push(
                    <tr key={r} className={"centered weight"}>
                        <td>{this.props.sentences['context'].at(r).at(0)}</td>
                        <td>{this.props.sentences['context'].at(r).at(1).at(t)}</td>
                    </tr>
                )
            }
        }
        return table
    }

    render() {  
        return (  
            <Fragment>  
                <Modal show={this.props.showModalPopup} onHide={this.handleClose} onShow={this.handleCreateLoad}
                    size="lg"  
                    aria-labelledby="contained-modal-title-vcenter"  
                    centered>  
                    <Modal.Body>  
                        <div className="centered">{this.props.term} </div>
                        
                        <table className="table table-hover tableBody t1">
                            <thead className="table-light">
                                <tr>
                                    <th className="cell-align-middle centered tableHeader">Location</th>
                                    <th className="cell-align-middle centered tableHeader">Sentences</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.sentences == null ?
                                    null :
                                    this.renderTable()
                                }
                            </tbody>
                        </table>

                    </Modal.Body>
                </Modal>  
            </Fragment>  
        );  
    }  
}  
  
export default (ModalPopup);