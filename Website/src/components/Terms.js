import React from 'react';
import ModalPopup from './modal_terms';


/*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: 
Description:
Returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
class Terms extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedTerms: [],
            page: 0,
            showModalPopup: false}
    }

    /*##################################################################################
                                        Modal Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    isShowPopup = (status, r) => {  
        this.setState({showModalPopup: status,
            modalTerm: r});
    };  


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    componentDidMount = () => {
        if(this.props.load) {
            this.props.loadCorpus()
        } else {
            this.props.getTerms()
        }
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }


    /*##################################################################################
                                        Select Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    selectTerm = (r) => {
        let selectedTerms = this.state.selectedTerms
        let newSelectedTerm = r//.toString()
        selectedTerms.push(newSelectedTerm)
        this.setState({selectedTerms: selectedTerms })
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    checkSelectedTerm = (r) => {
        let check = r//.toString()
        if (this.state.selectedTerms.includes(check)) {
            return true
        }
        return false
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    removedSelectedTerm = (r) => {
        let selectedTerms = this.state.selectedTerms
        let newSelectedTerm = r//.toString()
        for (let x = 0; x < this.state.selectedTerms.length; x++) {
            if (this.state.selectedTerms[x] === newSelectedTerm) {
                if (x == 0) {
                    selectedTerms.shift()
                } else {
                    selectedTerms.splice(x, 1)
                }
            }
        }
        this.setState({selectedTerms: selectedTerms})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    clearSelected = () => {
        this.setState({selectedTerms: []})
    }


    /*##################################################################################
                                        Term Functions
    ###################################################################################*/
    
    deleteTerms = () => {
        this.props.deleteTerms(this.state.selectedTerms)
        this.clearSelected()
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
        if ((this.state.page * 100) + 100 > Object.keys(this.props.weightDictionary).length) {
            for (let r = this.state.page * 100; r < Object.keys(this.props.weightDictionary).length; r++) {
                table.push(
                    <tr key = {r} className={"centered weight" + (this.checkSelectedTerm(r) === true ? " weight-selected" : "")}>
                        <td onClick={() => (this.checkSelectedTerm(r) ? 
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}>{Object.keys(this.props.weightDictionary)[r]}
                        </td>
                        <td onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.values(this.props.weightDictionary)[r].frequency}
                        </td>
                        <td onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}>{Object.values(this.props.weightDictionary)[r].weight}
                        </td>
                        <td>
                            <button className="btn" onClick={() => this.isShowPopup(true, r)}>
                                Sentences
                            </button>
                        </td>
                    </tr>
                )
            }
        } else {
            for (let r = this.state.page * 100; r < (this.state.page * 100) + 100; r++) {
                table.push(
                    <tr key = {r} className={"centered weight" + (this.checkSelectedTerm(r) === true ? " weight-selected" : "")}>
                        <td onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.keys(this.props.weightDictionary)[r]}
                        </td>
                        <td onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.values(this.props.weightDictionary)[r].frequency}
                        </td>
                        <td onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.values(this.props.weightDictionary)[r].weight}
                        </td>
                        <td>
                            <button className="btn" onClick={() => this.isShowPopup(true, r)}>
                                Sentences
                            </button>
                        </td>
                    </tr>
                )
            }
        }
        return table;
    }


    /*##################################################################################
                                        Page Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    page = (direction) => {
        if (direction == 'next') {
            this.setState({page: this.state.page + 1})
        } else {
            this.setState({page: this.state.page - 1})
        }
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    render() {
        return (
            <div className="page">
                 <ModalPopup showModalPopup={this.state.showModalPopup}  
                    onPopupClose={this.isShowPopup}
                    term={Object.keys(this.props.weightDictionary)[this.state.modalTerm]}
                    sentences={Object.values(this.props.weightDictionary)[this.state.modalTerm]}
                />
                <h2 className="pageTitle">
                    Step 2: Term Extraction
                </h2>
                <div className="pageBox">
                    <div className="termUploadSection">
                        <div className="modeBtn">
                            &nbsp;
                            {this.props.load ?
                                <>
                                    <button className="btn" onClick={() => this.props.loadCorpus()}>
                                        Refresh Weights:
                                    </button>
                                    <button className="btn" onClick={() => this.props.saveWeight()}>
                                        Save Weights:
                                    </button>
                                </>
                                :
                                <>
                                    <button className="btn" onClick={() => this.props.getTerms()}>
                                        Refresh Weights:
                                    </button>
                                    <button className="btn" onClick={() => this.props.saveWeight()}>
                                        Save Weights:
                                    </button>
                                </>
                            }
                        </div>
                        <h6 className="centered">
                            Select terms to remove
                        </h6>
                        <table className="table table-hover tableBody t1">
                            <thead className="table-light">
                                <tr>
                                    <th className="cell-align-middle centered tableHeader">
                                        NOUN
                                    </th>
                                    <th className="cell-align-middle centered tableHeader">
                                        FREQUENCY
                                    </th>
                                    <th className="cell-align-middle centered tableHeader">
                                        WEIGHT
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.props.weightDictionary).length === 0 ?
                                    <tr>
                                        <td></td>
                                    </tr>
                                    : this.renderTable()} 
                            </tbody>
                        </table>

                        <div className="btnLeft">
                            <button className="bottom3 btn" onClick={() => this.props.prevPage()}>
                                Back
                            </button>
                        </div>

                        <div className="btnCenter centered">
                            {this.state.page == 0 ?
                                <button className="btn" disabled={true} onClick={() => this.page('pervious')}>
                                    Previous:
                                </button> 
                                :
                                <button className="btn" onClick={() => this.page('pervious')}>
                                    Previous:
                                </button>
                            }

                            {this.state.page}

                            {(this.state.page * 100) + 100 < Object.keys(this.props.weightDictionary).length ?
                                <button className="btn" onClick={() => this.page('next')}>
                                    Next:
                                </button>
                                :
                                <button className="btn" disabled={true} onClick={() => this.page('next')}>
                                    Next:
                                </button>
                            }
                        </div>

                        <div className="btnRight">
                            <button className="right bottom3 btn" onClick={() =>  {this.props.nextPage()}}>
                                Forward 
                            </button>
                            {this.state.selectedTerms.length != 0 ?
                                <button className="right bottom3 btn" onClick={() => this.clearSelected()}> 
                                    Clear Selected
                                </button> 
                                :
                                <button disabled={true} className="right bottom3 btn" onClick={() => this.clearSelected()}>
                                    Clear Selected
                                </button>
                            }

                            {this.state.selectedTerms.length != 0 ?
                                <button className="right bottom3 btn" onClick={() => this.deleteTerms()}>
                                    Delete Terms
                                </button> 
                                :
                                <button disabled={true} className="right bottom3 btn" onClick={() => this.deleteTerms()}>
                                    Delete Terms
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Terms;