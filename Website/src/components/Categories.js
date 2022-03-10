import React from 'react';
import ModalPopup from './modal_popup';

class Categories extends React.Component {
    constructor() {  
        super();  
        this.state = {  
          showModalPopup: false,
          mode: "categories",
          cat: -1,
          selectedTerms: [],
          selectedWeightTerms: [],
          pageTerms: 0,
          pageCat: 0}  
    } 

  /*##################################################################################
                                    Modal Functions
  ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    isShowPopup = (status) => {  
        this.setState({ showModalPopup: status});  
    };  

  /*##################################################################################
                                    Table Functions
  ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    renderWeightTable = () => {
        const table = []

        if ((this.state.pageTerms * 100) + 100 > Object.keys(this.props.weightDictionary).length) {
            for (let r = this.state.pageTerms * 100; r < Object.keys(this.props.weightDictionary).length; r++) {
                table.push(
                    <tr key = {r} className={"centered weight" + (this.checkSelectedWeight(r) === true ? " weight-selected" : "")}
                        onClick={() => (this.checkSelectedWeight(r) ? this.removedSelectedWeightTerm(r) : this.selectWeightTerm(r))}>
                        <td className="table-data">
                            {Object.keys(this.props.weightDictionary)[r]}
                        </td>
                        <td className="table-data">
                            {Object.values(this.props.weightDictionary)[r].frequency}
                        </td>
                        <td className="table-data">
                            {Object.values(this.props.weightDictionary)[r].weight}
                        </td>
                    </tr>
                )
            }
        } else {
            for (let r = this.state.pageTerms * 100; r < (this.state.pageTerms * 100) + 100; r++) {
                table.push(
                    <tr key = {r} className={"centered weight" + (this.checkSelectedWeight(r) === true ? " weight-selected" : "")}
                        onClick={() => (this.checkSelectedWeight(r) ? this.removedSelectedWeightTerm(r) : this.selectWeightTerm(r))}>
                        <td className="table-data">
                            {Object.keys(this.props.weightDictionary)[r]}
                        </td>
                        <td className="table-data">
                            {Object.values(this.props.weightDictionary)[r].frequency}
                        </td>
                        <td className="table-data">
                            {Object.values(this.props.weightDictionary)[r].weight}
                        </td>
                    </tr>
                )
            }
        }
        return table;
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    renderCatTable = () => {
        const table = []
        if ((this.state.pageCat * 100) + 100 > Object.keys(this.props.categories).length) {
            for (let r = this.state.pageCat * 100; r < Object.keys(this.props.categories).length; r++) {
                table.push(
                    <tr onClick={() => this.changeMode(r)} className="centered weight" key={r}>
                        <td className="table-data">
                            {Object.keys(this.props.categories)[r]}
                        </td>
                        <td className="table-data">
                            <div className="maxHeight">
                                {this.renderCatTerms(r)}
                            </div>
                        </td>
                    </tr>
                )
            }
        } else {
            for (let r = this.state.pageCat * 100; r < (this.state.pageCat * 100) + 100; r++) {
                table.push(
                    <tr onClick={() => this.changeMode(r)} className="centered weight" key={r}>
                        <td className="table-data">
                            {Object.keys(this.props.categories)[r]}
                        </td>
                        <td className="table-data">
                            <div className="maxHeight">
                                {this.renderCatTerms(r)}
                            </div>
                        </td>
                    </tr>
                )
            }
        }
        return table;
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    renderCatTerms = (r) => {
        const Terms = [];
        if (this.state.cat === -1) {
            for (let d = 0; d < Object.values(Object.values(this.props.categories)[r]).length; d++) {
                Terms.push(<div className="term"> {Object.keys(Object.values(this.props.categories)[r])[d]} </div>)
            }
        } else {
            for (let d = 0; d < Object.values(Object.values(this.props.categories)[r]).length; d++) {
                Terms.push(
                    <button className={"term2 btn2" + (this.checkSelected(r, d) === true ? " term2-selected": "")}
                        onClick={ () => (this.checkSelected(r, d) === false ? this.selectTerm(r, d) : this.removeSelectedTerm(r, d)) }> 
                        {Object.keys(Object.values(this.props.categories)[r])[d]} 
                    </button>
                )
            }
        }
        return Terms
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    renderTermTable = () => {
        const table = []
        table.push(
            <tr className="centered" key={0}>
                <td className="table-data">
                    <div className="termBox">
                        {this.renderCatTerms(this.state.cat)}
                    </div>
                </td>
            </tr>
        )
        return table;
    }


    /*##################################################################################
                                    Select Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    selectWeightTerm = (r) => {
        let selectedWeightTerms = this.state.selectedWeightTerms
        let newSelectedWeightTerm = r.toString()
        selectedWeightTerms.push(newSelectedWeightTerm)
        this.setState({selectedWeightTerms: selectedWeightTerms })
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    checkSelectedWeight = (r) => {
        let check = r.toString()
        if (this.state.selectedWeightTerms.includes(check)) {
            return true
        }
        return false
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    removedSelectedWeightTerm = (r) => {
        let selectedWeightTerms = this.state.selectedWeightTerms
        let newSelectedWeightTerm = r.toString()
        for (let x = 0; x < this.state.selectedWeightTerms.length; x++) {
            if (this.state.selectedWeightTerms[x] === newSelectedWeightTerm) {
                if (x == 0) {
                    selectedWeightTerms.shift()
                } else {
                    selectedWeightTerms.splice(x, 1)
                }
            }
        }
        this.setState({selectedWeightTerms: selectedWeightTerms})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    selectTerm = (r, d) => {
        let selectedTerms = this.state.selectedTerms
        let newSelectedTerm = r.toString() + d.toString()
        selectedTerms.push(newSelectedTerm)
        this.setState({selectedTerms: selectedTerms })
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    removeSelectedTerm = (r, d) => {
        let selectedTerms = this.state.selectedTerms
        let newSelectedTerm = r.toString() + d.toString()
        for (let x = 0; x < this.state.selectedTerms.length; x++) {
            if (this.state.selectedTerms[x] === newSelectedTerm) {
                if (x == 0) {
                    selectedTerms.shift()
                } else {
                    selectedTerms.splice(x, 1)
                }
            }
        }
        this.setState({selectedTerms: selectedTerms })
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    checkSelected = (r, d) => {
        let check = r.toString() + d.toString()
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
    clearSelected = () => {
        this.setState({selectedTerms: [],
            selectedWeightTerms: []})
    }


    /*##################################################################################
                                    Page Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    changeMode = (r) => {
        if (this.state.mode === "categories") {
            this.setState({mode: "cat",
                cat: r})
        } else {
            this.setState({mode: "categories",
                cat: r})
        }
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    pageTerms = (direction) => {
        if (direction == 'next') {
            this.setState({pageTerms: this.state.pageTerms + 1})
        } else {
            this.setState({pageTerms: this.state.pageTerms - 1})
        }
    }

    
    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    pageCat = (direction) => {
        if (direction == 'next') {
            this.setState({pageCat: this.state.pageCat + 1})
        } else {
            this.setState({pageCat: this.state.pageCat - 1})
        }
    }


    /*##################################################################################
                               Weights/ Category Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    addToWeights = () => {
        this.props.addToWeights(this.state.selectedTerms)
        this.setState({selectedTerms: []})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    addToCategory = () => {
        this.props.addToCategory(this.state.selectedWeightTerms, this.state.cat)
        this.setState({selectedWeightTerms: []})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    deleteCat = () => {
        this.props.deleteCategory(this.state.cat)
        this.changeMode(-1)
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    saveCategories = () => {
        this.props.saveCategories(this.state.categories)
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
                            createCategory={this.props.createCategory}
                            categories={this.props.categories}
                        />
                        <div className="categories-header">
                            <h2 className="pageTitle">
                                Category Creation
                            </h2>
                        </div>
                        <div className="categories-content-box">
                            <div className="categories-terms-box">

                                <div className="categories-terms-box--left">

                                    <h1 className="centered">
                                        Terms
                                    </h1>
                                    <h6 className="centered">
                                        Select terms to move to category
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
                                            </tr>
                                        </thead>
                                        <tbody className="table-body--categories">
                                            {Object.keys(this.props.weightDictionary).length === 0 ?
                                                <tr>
                                                    <td></td>
                                                </tr>
                                                : 
                                                this.renderWeightTable()
                                            } 
                                        </tbody>
                                    </table>

                                    <div className="centered">
                                        {this.state.pageTerms == 0 ?
                                            <button className="button" disabled={true} onClick={() => this.pageTerms('pervious')}>
                                                Previous:
                                            </button>
                                            :
                                            <button className="button" onClick={() => this.pageTerms('pervious')}>
                                                Previous:
                                            </button>
                                        }
                                        
                                        {this.state.pageTerms}

                                        {(this.state.pageTerms * 100) + 100 <  Object.keys(this.props.weightDictionary).length ?
                                            <button className="button" onClick={() => this.pageTerms('next')}>
                                                Next:
                                            </button> 
                                            :
                                            <button className="button" disabled={true} onClick={() => this.pageTerms('next')}>
                                                Next:
                                            </button>
                                        }
                                    </div>   
                                </div>

                                <div className="categories-terms-box--center">
                                    <h6 className="categories-sub-header centered"> Edit Categories</h6>
                                    &nbsp;
                                    {this.state.cat === -1 ? 
                                        <button className="button categories__buttons" onClick={() => this.isShowPopup(true)}>
                                            Create New Category
                                        </button> 
                                        : 
                                        <button className="button categories__buttons" onClick={() => this.changeMode(-1)}>
                                            Exit Category
                                        </button>
                                    }
                                    &nbsp;
                                    {this.state.cat === -1 ? 
                                        null 
                                        : 
                                        <button className="button categories__buttons" onClick={() => this.deleteCat()}>
                                            Delete Category
                                        </button>
                                    }
                                    &nbsp;
                                    {this.state.cat === -1 ?
                                        null 
                                        :
                                        this.state.selectedTerms.length == 0 ?
                                            <button disabled={true} onClick={() => this.addToWeights()} className="button categories__buttons">
                                                &lt;&lt;&lt;
                                            </button> 
                                            :
                                            <button onClick={() => this.addToWeights()} className="button categories__buttons">
                                                &lt;&lt;&lt;
                                            </button>
                                    }
                                    &nbsp;
                                    {this.state.cat === -1 ?
                                        null 
                                        :
                                        this.state.selectedWeightTerms.length == 0 ?
                                            <button disabled={true} className="button categories__buttons" onClick={() => this.addToCategory()}>
                                                &gt;&gt;&gt;
                                            </button> 
                                            :
                                            <button className="button categories__buttons" onClick={() => this.addToCategory()}>
                                                &gt;&gt;&gt;
                                            </button>
                                    }
                                    &nbsp;
                                    {this.state.selectedWeightTerms.length != 0 || this.state.selectedTerms.length != 0 ?
                                        <button className="button categories__buttons" onClick={() => this.clearSelected()}>
                                            Clear Selected
                                        </button> 
                                        :
                                        <button disabled={true} className="button categories__buttons" onClick={() => this.clearSelected()}>
                                            Clear Selected
                                        </button>
                                    }
                                    &nbsp;
                                    {this.state.cat === -1  ?
                                        <button className="button categories__buttons" onClick={() => this.saveCategories()}>
                                            Save Categories
                                        </button> 
                                        :
                                        null
                                    }
                                </div>

                                <div className="categories-terms-box--right">
                                    {this.state.mode === "categories" ?
                                        <div>
                                            <h1 className="centered">
                                                CATEGORIES
                                            </h1>
                                            <h6 className="centered">
                                                Select a category to edit
                                            </h6>
                                            <table className="table table-hover tableBody tr">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="cell-align-middle centered tableHeader">
                                                            Category
                                                        </th>
                                                        <th className="cell-align-middle centered tableHeader">
                                                            Terms
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-body--categories">
                                                    {Object.keys(this.props.categories).length === 0 ?
                                                        <tr>
                                                            <td></td>
                                                        </tr>
                                                        : this.renderCatTable()
                                                    } 
                                                </tbody>
                                            </table> 
                                            <div className="centered">
                                                {this.state.pageCat == 0 ?
                                                    <button className="button" disabled={true} onClick={() => this.pageCat('pervious')}>
                                                        Previous:
                                                    </button>
                                                    :
                                                    <button className="button" onClick={() => this.pageCat('pervious')}>
                                                        Previous:
                                                    </button>
                                                }
                                                {this.state.pageCat}
                                                {(this.state.pageCat * 100) + 100 <  Object.keys(this.props.categories).length ?
                                                    <button className="button" onClick={() => this.pageCat('next')}>
                                                        Next:
                                                    </button> 
                                                    :
                                                    <button className="button" disabled={true} onClick={() => this.pageCat('next')}>
                                                        Next:
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <h1 className="centered">
                                                {Object.keys(this.props.categories)[this.state.cat]}
                                            </h1>
                                            <h6 className="centered">
                                                Select terms to remove from category
                                            </h6>
                                            <table className="table tableBody tr">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="cell-align-middle centered tableHeader">
                                                                Terms
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="table-body--categories">
                                                        {Object.keys(this.props.categories).length === 0 ?
                                                            <tr>
                                                                <td>
                                                                </td>
                                                            </tr>
                                                            : 
                                                            this.renderTermTable()
                                                        } 
                                                    </tbody>
                                            </table> 
                                        </div>
                                    }
                                </div>




                            </div>
                            <div className="page-button-box">
                                <button className="button" onClick={() => this.props.prevPage()}>
                                    Back
                                </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button className="button" onClick={() => this.props.nextPage()}>
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

export default Categories;