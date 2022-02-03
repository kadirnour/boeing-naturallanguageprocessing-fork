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
          selectedWeightTerms: []
        }  
    } 

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                       Modal Popup Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Displays modal popup
    isShowPopup = (status) => {  
        this.setState({ showModalPopup: status});  
    };  

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                   Left Side (Terms) Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Renders the weight table
    renderWeightTable = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.props.weights).length; r++) {
          table.push(
            <tr className={"centered weight" + (this.checkSelectedWeight(r) === true ? " weight-selected" : "")} key={r} 
                onClick={() => (this.checkSelectedWeight(r) ? this.removedSelectedWeightTerm(r) : this.selectWeightTerm(r))}>
              <td>{Object.keys(this.props.weights)[r]}</td>
              <td>{Object.values(this.props.weights)[r].frequency}</td>
              <td>{Object.values(this.props.weights)[r].weight}</td>
            </tr>
          )
        }
        return table;
    }

    // User has selected a term from the weights table
    selectWeightTerm = (r) => {
        let selectedWeightTerms = this.state.selectedWeightTerms
        let newSelectedWeightTerm = r.toString()
        selectedWeightTerms.push(newSelectedWeightTerm)
        this.setState({selectedWeightTerms: selectedWeightTerms })
    }

    // Checks which terms in the weights table user has selected currently
    checkSelectedWeight = (r) => {
        let check = r.toString()
        if (this.state.selectedWeightTerms.includes(check)) {
            return true
        }
        return false
    }

    // User has deselected a term from the weights table
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

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                 Right Side (Categories) Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    // Renders all categories in a table
    renderCatTable = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.props.categories).length; r++) {
            table.push(
                <tr onClick={() => this.changeMode(r)} className="centered weight" key={r}>
                    <td>
                        {Object.keys(this.props.categories)[r]}
                    </td>
                    <td>
                        <div className="termBox">
                            {this.renderCatTerms(r)}
                        </div>
                    </td>
                </tr>
            )
        }
        return table;
    }

    // Renders terms in each category
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

    // Renders selected category table
    renderTermTable = () => {
        const table = []
        table.push(
            <tr className="centered" key={0}>
                <td>
                    <div className="termBox">
                        {this.renderCatTerms(this.state.cat)}
                    </div>
                </td>
            </tr>
        )
        return table;
    }

    // User has selected a term from a category
    selectTerm = (r, d) => {
        let selectedTerms = this.state.selectedTerms
        let newSelectedTerm = r.toString() + d.toString()
        selectedTerms.push(newSelectedTerm)
        this.setState({selectedTerms: selectedTerms })
    }

    // User has deslected a term from a category
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

    // Checks which terms in the category the user has selected currently
    checkSelected = (r, d) => {
        let check = r.toString() + d.toString()
        if (this.state.selectedTerms.includes(check)) {
            return true
        }
        return false
    }

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                    Center (Buttons) Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Changes the mode to display the categories and buttons
    changeMode = (r) => {
        if (this.state.mode === "categories") {
            this.setState({mode: "cat",
                           cat: r})
        } else {
            this.setState({mode: "categories",
                           cat: r})
        }
    }

    // Clears all selected terms
    clearSelected = () => {
        this.setState({selectedTerms: [],
                       selectedWeightTerms: []})
    }

    // Removes a selected term from category and adds it back to weights list
    addToWeights = () => {
        this.props.addToWeights(this.state.selectedTerms)
        this.setState({selectedTerms: []})
    }

    // Removed a selected term from weights list and adds it to a category
    addToCategory = () => {
        this.props.addToCategory(this.state.selectedWeightTerms, this.state.cat)
        this.setState({selectedWeightTerms: []})
    }

    // Deletes a catergory and adds terms back to weight
    deleteCat = () => {
        this.props.deleteCategory(this.state.cat)
        this.changeMode(-1)
    }

    //sends the categories to the flask route so we can save on csv
    saveCategories = () => {
        this.props.saveCategories(this.state.categories)
    }

    render() {
        return (
            <div className="page">
                <ModalPopup showModalPopup={this.state.showModalPopup}  
                            onPopupClose={this.isShowPopup}
                            createCategory={this.props.createCategory}
                            categories={this.props.categories}/>
                <h2 className="pageTitle"> Step 3: Categories </h2>
                <div className="pageBox">
                    <div className="categoriesUploadSection">
                        {/* <div className="modeBtn">
                            <button className="btn" onClick={() => this.props.getWeight()}> Get Weights: </button>
                        </div> */}

                        <div className="categoriesLeft">
                            <h1 className="centered"> TERMS </h1>
                            <h6 className="centered"> Select terms to move to category </h6>
                            <table className="table table-hover tableBody tl">
                                <thead className="table-light">
                                    <tr>
                                        <th className="cell-align-middle centered tableHeader">NOUN</th>
                                        <th className="cell-align-middle centered tableHeader">FREQUENCY</th>
                                        <th className="cell-align-middle centered tableHeader">WEIGHT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(this.props.weights).length === 0 ?
                                        <tr>
                                            <td></td>
                                        </tr>
                                        : this.renderWeightTable()
                                    } 
                                </tbody>
                            </table>
                        </div>

                        <div className="categoriesCenter">
                            <h6 className="centered"> Edit Categories \/ </h6>
                            &nbsp;
                            {this.state.cat === -1 ? 
                                <button className="btn" onClick={() => this.isShowPopup(true)}>
                                    Create New Category
                                </button> : 
                                <button className="btn" onClick={() => this.changeMode(-1)}>
                                    Exit Category
                                </button>
                            }
                            &nbsp;
                            {this.state.cat === -1 ? 
                                null : 
                                <button className="btn" onClick={() => this.deleteCat()}>
                                    Delete Category
                                </button>
                            }
                            &nbsp;
                            {this.state.selectedTerms.length == 0 ?
                                null :
                                <button onClick={() => this.addToWeights()} className="btn">
                                    &lt;&lt;&lt;
                                </button>
                            }
                            &nbsp;
                            {this.state.selectedWeightTerms.length == 0 || this.state.cat == -1 ? 
                                null : 
                                <button className="btn" onClick={() => this.addToCategory()}>
                                    &gt;&gt;&gt;
                                </button>
                            }
                            &nbsp;
                            {this.state.selectedWeightTerms.length != 0 || this.state.selectedTerms.length != 0 ?
                                <button className="btn" onClick={() => this.clearSelected()}>
                                    Clear Selected
                                </button> :
                                null
                            }
                            &nbsp;
                            {this.state.cat === -1  ?
                                <button className="btn" onClick={() => this.saveCategories()}>
                                    Save Categories
                                </button> :
                                null
                            }
                        </div>

                        <div className="categoriesRight">
                            {this.state.mode === "categories" ?
                                <div>
                                    <h1 className="centered"> CATEGORIES </h1>
                                    <h6 className="centered"> Select a category to edit </h6>
                                    <table className="table table-hover tableBody tr">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="cell-align-middle centered tableHeader">Category</th>
                                                <th className="cell-align-middle centered tableHeader">Terms</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(this.props.categories).length === 0 ?
                                                <tr>
                                                    <td></td>
                                                </tr>
                                                : this.renderCatTable()
                                            } 
                                        </tbody>
                                    </table> 
                                </div> :
                                <div>
                                    <h1 className="centered"> {Object.keys(this.props.categories)[this.state.cat]} </h1>
                                    <h6 className="centered"> Select terms to remove from category </h6>
                                    <table className="table tableBody tr">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="cell-align-middle centered tableHeader">Terms</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(this.props.categories).length === 0 ?
                                                    <tr>
                                                        <td>
                                                        </td>
                                                    </tr>
                                                    : this.renderTermTable()
                                                } 
                                            </tbody>
                                    </table> 
                                </div>
                            }
                        </div>

                        <div className="modeBtn">
                            <button className="btn bottom4" onClick={() => this.props.prevPage()}> Back </button>
                            <button className="right btn bottom4" onClick={() => this.props.nextPage()}> Forward </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Categories;