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
                        <td className="table-data" onClick={() => (this.checkSelectedTerm(r) ? 
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}>{Object.keys(this.props.weightDictionary)[r]}
                        </td>
                        <td className="table-data" onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.values(this.props.weightDictionary)[r].frequency}
                        </td>
                        <td className="table-data" onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}>{Object.values(this.props.weightDictionary)[r].weight}
                        </td>
                        <td className="table-data">
                            <button className="button" onClick={() => this.isShowPopup(true, r)}>
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
                        <td className="table-data" onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.keys(this.props.weightDictionary)[r]}
                        </td>
                        <td className="table-data" onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.values(this.props.weightDictionary)[r].frequency}
                        </td>
                        <td className="table-data" onClick={() => (this.checkSelectedTerm(r) ?
                            this.removedSelectedTerm(r)
                            :
                            this.selectTerm(r))}> {Object.values(this.props.weightDictionary)[r].weight}
                        </td>
                        <td className="table-data">
                            <button className="button" onClick={() => this.isShowPopup(true, r)}>
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
            <div className="section">
                <div className="container">
                    <div className="terms-wrapper">
                        <ModalPopup showModalPopup={this.state.showModalPopup}  
                            onPopupClose={this.isShowPopup}
                            term={Object.keys(this.props.weightDictionary)[this.state.modalTerm]}
                            sentences={Object.values(this.props.weightDictionary)[this.state.modalTerm]}
                        />
                        <div className="terms-header">
                            <h2 className="pageTitle">
                                Term Extraction/ Selection
                            </h2>
                        </div>
                        <div className="terms-content-box">
                            <div className="terms-input-box">
                                {this.props.load ?
                                    <div>
                                        <button className="button" onClick={() => this.props.loadCorpus()}>
                                            Refresh Weights:
                                        </button> &nbsp;&nbsp;&nbsp;
                                        <button className="button" onClick={() => this.props.saveWeight()}>
                                            Save Weights:
                                        </button>
                                    </div>
                                    :
                                    <div>  
                                        <button className="button" onClick={() => this.props.getTerms()}>
                                            Refresh Weights:
                                        </button> &nbsp;&nbsp;&nbsp;
                                        <button className="button" onClick={() => this.props.saveWeight()}>
                                            Save Weights:
                                        </button>
                                    </div>
                                } 
                            </div> &nbsp;
                            <h6 className="terms-sub-header">
                                Select terms to remove
                            </h6>
                            <table className="table table-head">
                                <thead className="table-light">
                                    <tr>
                                        <th className="centered table-header">
                                            Noun
                                        </th>
                                        <th className="centered table-header">
                                            Frequency
                                        </th>
                                        <th className="centered table-header">
                                            Weight
                                        </th>
                                        <th>
                                            Sentences
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-body--terms">
                                    {Object.keys(this.props.weightDictionary).length === 0 ?
                                        <tr>
                                            <td></td>
                                        </tr>
                                        : this.renderTable()} 
                                </tbody>
                            </table>
                            <div className="terms-input-box">
                                    {this.state.page == 0 ?
                                        <button className="button" disabled={true} onClick={() => this.page('pervious')}>
                                            Previous:
                                        </button> 
                                        :
                                        <button className="button" onClick={() => this.page('pervious')}>
                                            Previous:
                                        </button>
                                    } &nbsp;&nbsp;&nbsp;
                                    {this.state.page} &nbsp;&nbsp;&nbsp;
                                    {(this.state.page * 100) + 100 < Object.keys(this.props.weightDictionary).length ?
                                        <button className="button" onClick={() => this.page('next')}>
                                            Next:
                                        </button>
                                        :
                                        <button className="button" disabled={true} onClick={() => this.page('next')}>
                                            Next:
                                        </button>
                                    }
                            </div>
                            <div className="terms-input-box">
                                {this.state.selectedTerms.length != 0 ?
                                    <button className="button" onClick={() => this.clearSelected()}> 
                                        Clear Selected
                                    </button> 
                                    :
                                    <button disabled={true} className="button" onClick={() => this.clearSelected()}>
                                        Clear Selected
                                    </button>
                                } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {this.state.selectedTerms.length != 0 ?
                                    <button className="button" onClick={() => this.deleteTerms()}>
                                        Delete Terms
                                    </button> 
                                    :
                                    <button disabled={true} className="button" onClick={() => this.deleteTerms()}>
                                        Delete Terms
                                    </button>
                                }
                            </div>

                            <div className="page-button-box">
                                <button className="button" onClick={() => this.props.prevPage()}>
                                    Back
                                </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button className="button" onClick={() =>  {this.props.nextPage()}}>
                                    Forward 
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