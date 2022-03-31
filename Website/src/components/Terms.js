import React from 'react';
import ModalPopup from './modal_terms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faBackward, faForward, faFileArrowDown, faFileLines, faAngleRight, faAngleLeft, faRotateRight, faTrash }
    from '@fortawesome/free-solid-svg-icons'

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
    Function: isShowPopup
    Description: decides if the popup should be shown
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    isShowPopup = (status, type, row) => {  
        this.setState({showModalPopup: status, // true to show popup
            type:type, // which modal should be displayed
            modalTerm: row // the term that the modal is displaying
        });
    };  

    /*##################################################################################
                                        Select Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: selectTerm
    Description: user selects a term from the list (the row the term is in)
    Returns: sets in state selected terms
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    selectTerm = (row) => {
        let selectedTerms = this.state.selectedTerms
        selectedTerms.push(row)

        this.setState({selectedTerms: selectedTerms})
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: checkSelectedTerm
    Description: checks if the row is selected or not
    Returns: true if the row is selected already
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    checkSelectedTerm = (row) => {
        if (this.state.selectedTerms.includes(row)) {
            return true
        }
        return false
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: removedSelectedTerm
    Description: removes the selected term from the list
    Returns: sets in state the new selected terms
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    removedSelectedTerm = (row) => {
        let selectedTerms = this.state.selectedTerms

        for (let i = 0; i < this.state.selectedTerms.length; i++) { // each currently selected term
            if (this.state.selectedTerms[i] === row) { // this is the row to deselect
                if (i === 0) { // the selected terms list only has one item
                    selectedTerms.shift()
                } else { // the selected terms list has multiple items
                    selectedTerms.splice(i, 1)
                }
            }
        }

        this.setState({selectedTerms: selectedTerms})
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: clearSelected
    Description: clears all selected terms from the list
    Returns: sets in state a empty selected terms list
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    clearSelected = () => {
        this.setState({selectedTerms: []})
    }


    /*##################################################################################
                                        Term Functions
    ###################################################################################*/
   
    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: deleteTerms
    Description: deletes terms from selected list out of weight dictionary
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    deleteTerms = () => {
        this.props.deleteTerms(this.state.selectedTerms)
        this.clearSelected()
    }


    /*##################################################################################
                                        Table Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: renderTermTable
    Description: renders the terms from weight dictionary as a table
    Returns: list of terms
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    renderTermTable = () => {
        const table = []
        if ((this.state.page * 100) + 100 > Object.keys(this.props.weightDictionary).length) { // if there are less then 100 terms in the weight dictionary
            for (let r = this.state.page * 100; r < Object.keys(this.props.weightDictionary).length; r++) { // pagination, only display 100 terms
                table.push(
                    <tr key = {r} className={"table-row" + (this.checkSelectedTerm(r) === true ? " table-row--selected" : "")}>
                        <td onClick={() => (this.checkSelectedTerm(r) ? 
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}>
                            {Object.keys(this.props.weightDictionary)[r]}
                        </td>
                        <td onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> 
                            {Object.values(this.props.weightDictionary)[r].frequency}
                        </td>
                        <td onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}>
                            {Object.values(this.props.weightDictionary)[r].weight}
                        </td>

                        <td className="table-data">
                            <button className="button" onClick={() => this.isShowPopup(true, "", r)}>
                              <FontAwesomeIcon icon={faFileLines}/> &nbsp; 
                              Sentences
                            </button>
                        </td>
                    </tr>
                )
            }
        } else { // there are more then 100 terms in the weight dictionary
            for (let r = this.state.page * 100; r < (this.state.page * 100) + 100; r++) { // pagination, only display 100 terms
                table.push(
                    <tr key = {r} className={"table-row" + (this.checkSelectedTerm(r) === true ? " table-row--selected" : "")}>
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
                        <td className="table-data">
                            <button className="button" onClick={() => this.isShowPopup(true,"", r)}>
                                <FontAwesomeIcon icon={faFileLines}/> &nbsp; 
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

    /*''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: componentDidMount
    Description: either runs the parser or loads from .csv whenever this page is viewed
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    componentDidMount = () => {
        if (this.props.load) { // load from .csv
            this.props.loadCorpus()
        } else { // run parser
            this.props.getTerms()
        }
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: page
    Description: pagination, current page number of terms
    Returns: sets in state current page number
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    page = (direction) => {
        if (direction === 'next') { // go forward a page
            this.setState({page: this.state.page + 1})
        } else { // go back a page
            this.setState({page: this.state.page - 1})
        }
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: saveWeight
    Description: opens save confirmation to save the weight dictionary to .csv
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    saveWeight = () => {
        this.isShowPopup(true, "confirm", -1)
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: confirmSave
    Description: the save has been confirmed, save weight dictionary to .csv
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    confirmSave = () =>{
        this.props.saveWeight()
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: render
    Description: renders Terms page from pipeline
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    render() {
        return (
            <div className="section">
                <div className="container">
                    <div className="terms-wrapper">
                        <ModalPopup showModalPopup={this.state.showModalPopup}  
                            onPopupClose={this.isShowPopup}
                            type={this.state.type}
                            confirmSave={this.confirmSave}
                            term={Object.keys(this.props.weightDictionary)[this.state.modalTerm]}
                            sentences={Object.values(this.props.weightDictionary)[this.state.modalTerm]}
                        />
                        <h2 className="terms-header">
                            Term Extraction/ Selection
                        </h2>
                        <div className="terms-content-box">
                            <div className="terms-content-box--centered">
                                <div className="terms-input-box">
                                    {this.props.load ? // loading mode (you are loading from a .csv)
                                        <div>
                                            <button className="button__small" onClick={() => this.props.loadCorpus()}>
                                                <FontAwesomeIcon icon={faArrowsRotate}/> &nbsp; 
                                                Refresh Weights:
                                            </button> &nbsp;&nbsp;&nbsp;
                                            <button className="button__small" onClick={() => this.saveWeight()}>
                                                <FontAwesomeIcon icon={faFileArrowDown}/> &nbsp; 
                                                Save Weights:
                                            </button>
                                        </div>
                                        : // creating a new taxonomy
                                        <div>  
                                            <button className="button__small" onClick={() => this.props.getTerms()}>
                                                <FontAwesomeIcon icon={faArrowsRotate}/> &nbsp; 
                                                Refresh Weights:
                                            </button> &nbsp;&nbsp;&nbsp;
                                            <button className="button__small" onClick={() => this.saveWeight()}>
                                                <FontAwesomeIcon icon={faFileArrowDown}/> &nbsp; 
                                                Save Weights:
                                            </button>
                                        </div>
                                    } 
                                    <hr className="hr"/>
                                </div>
                                <h6 className="terms-sub-header">
                                    Select terms to remove
                                </h6>
                                <div className="table-box--terms">
                                    <table className="table table-head">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="table-header">
                                                    Noun
                                                </th>
                                                <th className="table-header">
                                                    Frequency
                                                </th>
                                                <th className="table-header">
                                                    Weight
                                                </th>
                                                <th>
                                                    Sentences
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(this.props.weightDictionary).length === 0 ? // there are not terms in weight dictionary
                                                <tr>
                                                    <td></td>
                                                </tr>
                                                : 
                                                this.renderTermTable()} 
                                        </tbody>
                                    </table>
                                </div>
                                <div className="terms-button-box">
                                    <div className="terms-input-box">
                                            {this.state.page === 0 ? // page 0
                                                <button className="button__small--disabled" disabled={true} onClick={() => this.page('pervious')}>
                                                    <FontAwesomeIcon icon={faAngleLeft}/> &nbsp; 
                                                    Previous:
                                                </button> 
                                                :
                                                <button className="button__small" onClick={() => this.page('pervious')}>
                                                    <FontAwesomeIcon icon={faAngleLeft}/> &nbsp; 
                                                    Previous:
                                                </button>
                                            } &nbsp;&nbsp;&nbsp;
                                            {this.state.page} &nbsp;&nbsp;&nbsp;
                                            {(this.state.page * 100) + 100 < Object.keys(this.props.weightDictionary).length ? // there are still terms to page through
                                                <button className="button__small" onClick={() => this.page('next')}>
                                                    Next: &nbsp; 
                                                    <FontAwesomeIcon icon={faAngleRight}/>
                                                </button>
                                                : // there are no more terms to page through
                                                <button className="button__small--disabled" disabled={true} onClick={() => this.page('next')}>
                                                    Next: &nbsp; 
                                                    <FontAwesomeIcon icon={faAngleRight}/>
                                                </button>
                                            }
                                    </div>
                                    <div className="terms-input-box">
                                        {this.state.selectedTerms.length !== 0 ? // terms have been selected
                                            <button className="button__small" onClick={() => this.clearSelected()}> 
                                                <FontAwesomeIcon icon={faRotateRight}/> &nbsp; 
                                                Clear Selected
                                            </button> 
                                            : // no terms have been selected
                                            <button disabled={true} className="button__small--disabled" onClick={() => this.clearSelected()}>
                                                <FontAwesomeIcon icon={faRotateRight}/> &nbsp; 
                                                Clear Selected
                                            </button>
                                        } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {this.state.selectedTerms.length !== 0 ? // terms have been selected
                                            <button className="button__small red" onClick={() => this.deleteTerms()}>
                                                <FontAwesomeIcon icon={faTrash}/> &nbsp; 
                                                Delete Terms
                                            </button> 
                                            : // no terms have been selected
                                            <button disabled={true} className="button__small--disabled" onClick={() => this.deleteTerms()}>
                                                <FontAwesomeIcon icon={faTrash}/> &nbsp; 
                                                Delete Terms
                                            </button>
                                        }
                                    </div>
                                </div>  
                            </div>
                            <div className="page-button-box">
                                <button className="button__small" onClick={() => this.props.prevPage()}>
                                    <FontAwesomeIcon icon={faBackward}/> &nbsp; 
                                    Back
                                </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button className="button__small" onClick={() =>  {this.props.nextPage()}}>
                                    Forward &nbsp; 
                                    <FontAwesomeIcon icon={faForward}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Terms;