import React from 'react';
import ModalPopup from './modal_terms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsRotate, faBackward, faForward, faFileArrowDown, faFileLines, faAngleRight, faAngleLeft, faRotateRight, faTrash }
    from '@fortawesome/free-solid-svg-icons'


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
    isShowPopup = (status, type, r) => {  
        this.setState({showModalPopup: status,
            type:type,
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
        } else {
            for (let r = this.state.page * 100; r < (this.state.page * 100) + 100; r++) {
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
    saveWeight = () => {
        this.isShowPopup(true, "confirm", -1)
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
    confirmSave = () =>{
        this.props.saveWeight()
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
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
                                    {this.props.load ?
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
                                        :
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
                                            {Object.keys(this.props.weightDictionary).length === 0 ?
                                                <tr>
                                                    <td></td>
                                                </tr>
                                                : this.renderTable()} 
                                        </tbody>
                                    </table>
                                </div>
                                <div className="terms-button-box">
                                    <div className="terms-input-box">
                                            {this.state.page == 0 ?
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
                                            {(this.state.page * 100) + 100 < Object.keys(this.props.weightDictionary).length ?
                                                <button className="button__small" onClick={() => this.page('next')}>
                                                    Next: &nbsp; 
                                                    <FontAwesomeIcon icon={faAngleRight}/>
                                                </button>
                                                :
                                                <button className="button__small--disabled" disabled={true} onClick={() => this.page('next')}>
                                                    Next: &nbsp; 
                                                    <FontAwesomeIcon icon={faAngleRight}/>
                                                </button>
                                            }
                                    </div>
                                    
                                    <div className="terms-input-box">
                                        {this.state.selectedTerms.length != 0 ?
                                            <button className="button__small" onClick={() => this.clearSelected()}> 
                                                <FontAwesomeIcon icon={faRotateRight}/> &nbsp; 
                                                Clear Selected
                                            </button> 
                                            :
                                            <button disabled={true} className="button__small--disabled" onClick={() => this.clearSelected()}>
                                                <FontAwesomeIcon icon={faRotateRight}/> &nbsp; 
                                                Clear Selected
                                            </button>
                                        } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {this.state.selectedTerms.length != 0 ?
                                            <button className="button__small red" onClick={() => this.deleteTerms()}>
                                                <FontAwesomeIcon icon={faTrash}/> &nbsp; 
                                                Delete Terms
                                            </button> 
                                            :
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
                                    <FontAwesomeIcon icon={faForward}/> &nbsp; 
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