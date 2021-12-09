import React from 'react';

class Terms extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedTerms: []}
    }

    submitOutput = () => {
        this.props.setOutput(this.state.output)
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    // User has selected a term from the weights table
    selectTerm = (r) => {
        let selectedTerms = this.state.selectedTerms
        let newSelectedTerm = r.toString()
        selectedTerms.push(newSelectedTerm)
        this.setState({selectedTerms: selectedTerms })
    }

    // Checks which terms in the weights table user has selected currently
    checkSelectedTerm = (r) => {
        let check = r.toString()
        if (this.state.selectedTerms.includes(check)) {
            return true
        }
        return false
    }

    // User has deselected a term from the weights table
    removedSelectedTerm = (r) => {
        console.log(r)
        let selectedTerms = this.state.selectedTerms
        let newSelectedTerm = r.toString()
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

    // Renders term table
    renderTable = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.props.dict).length; r++) {
          table.push(
            <tr key = {r} className={"centered weight" + (this.checkSelectedTerm(r) === true ? " weight-selected" : "")}
                onClick={() => (this.checkSelectedTerm(r) ? this.removedSelectedTerm(r) : this.selectTerm(r))}>
              <td>{Object.keys(this.props.dict)[r]}</td>
              <td>{Object.values(this.props.dict)[r]}</td>
            </tr>
          )
        }
        return table;
    }

    // Clears selected terms
    clearSelected = () => {
        this.setState({selectedTerms: []})
    }

    // Autocompletes output location to recommened location
    recommend = () => {
        this.props.setOutput("C:\\Users\\blcsi\\OneDrive\\Desktop\\boeing-naturallanguageprocessing\\Parser\\output")
    }

    deleteTerms = () => {
        this.props.deleteTerms(this.state.selectedTerms)
        this.clearSelected()
    }

    render() {
        return (
            <div className="page">
                <h2 className="pageTitle"> Step 2: Term Extraction </h2>
                <div className="pageBox">
                    <div className="termUploadSection">
                        &nbsp;
                        <div className="modeBtn">
                            &nbsp;&nbsp;
                            <input onChange={this.handleChange} name="output" placeholder="Enter Output Directory"/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn" onClick={() => this.submitOutput()}> Enter: </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn" onClick={() => this.recommend()}> Recommendation: </button>
                        </div>
                        <div className="folderLocation">
                            Output Location:
                            &nbsp;
                            {this.props.oldOutput}
                        </div>
                        &nbsp;
                        <div className="modeBtn">
                            &nbsp;
                            <button className="btn" onClick={() => this.props.Parser()}> Run Parser: </button>
                        </div>
                        <h6 className="centered"> Select terms to remove </h6>
                        <table className="table table-hover tableBody t1">
                            <thead className="table-light">
                                <tr>
                                    <th className="cell-align-middle centered tableHeader">Term</th>
                                    <th className="cell-align-middle centered tableHeader">FREQUENCY</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.props.dict).length === 0 ?
                                    <tr>
                                        <td></td>
                                    </tr>
                                    : this.renderTable()} 
                            </tbody>
                        </table>
                        <div className="modeBtn">
                            <button className="bottom3 btn" onClick={() => this.props.prevPage()}> Back </button>
                            <button className="right bottom3 btn" onClick={() =>  this.props.nextPage()}> Forward </button>
                            {this.state.selectedTerms.length != 0 ?
                                <button className="right bottom3 btn" onClick={() => this.clearSelected()}> Clear Selected </button> :
                                null
                            }
                            {this.state.selectedTerms.length != 0 ?
                                <button className="right bottom3 btn" onClick={() => this.deleteTerms()}> Delete Terms </button> :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Terms;