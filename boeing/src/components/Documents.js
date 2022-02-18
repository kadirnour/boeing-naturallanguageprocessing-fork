import React from 'react';

class Documents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {corpusName: 'corpus'}
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    submitInput = () => {
        this.props.setInput(this.state.input)
    }
    
    submitOutput = () => {
        this.props.setOutput(this.state.output)
    }

    // Autocompletes output location to recommened location
    recommend = () => {
        this.props.setInput("C:\\Users\\blcsi\\OneDrive\\Desktop\\boeing-naturallanguageprocessing\\Parser\\data")
    }

    recommendOut = () => {
        this.props.setOutput("C:\\Users\\blcsi\\OneDrive\\Desktop\\boeing-naturallanguageprocessing\\Parser\\output")
    }

    // Renders term table
    renderTable = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.props.files).length; r++) {
          table.push(
            <tr key = {r} className="weight">
                <td className="centered">
                  {Object.keys(this.props.files)[r] + Object.values(this.props.files)[r]}
                </td>
                <td className="centered">
                    <button className="btn-delete" onClick={() => this.props.deleteFile(r)}>
                        Delete
                    </button>
                </td>
            </tr>
          )
        }
        return table;
    }
    
    render() {
        return (
            <div className="page">
                <h2 className="pageTitle"> Step 1: Document Corpus </h2>
                <div className="pageBox">
                    <div className="documentUploadSection">
                        &nbsp;
                        <div className="modeBtn">
                            &nbsp;&nbsp;
                            <input onChange={this.handleChange} name="input" placeholder="Enter Input Directory"/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn" onClick={() => this.submitInput()}> Enter Input: </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn" onClick={() => this.recommend()}> Recommendation: </button>
                            &nbsp;
                            <h7>*data folder in parser</h7>
                        </div>
                        <div className="folderLocation">
                            &nbsp;
                            Input Location:
                            &nbsp;
                            {this.props.oldInput}
                        </div>
                        &nbsp;
                        <div className="modeBtn">
                            &nbsp;&nbsp;
                            <input onChange={this.handleChange} name="output" placeholder="Enter Output Directory"/>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn" onClick={() => this.submitOutput()}> Enter Output: </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn" onClick={() => this.recommendOut()}> Recommendation: </button>
                            &nbsp;
                            <h7>*output folder in parser</h7>
                        </div>
                        <div className="folderLocation">
                            &nbsp;
                            Output Location:
                            &nbsp;
                            {this.props.oldOutput}
                        </div>
                        &nbsp;
                        <div>
                            &nbsp;&nbsp;
                            <button className="btn-files" onClick={() => this.props.Files()}> Refresh Files: </button>
                        </div>
                        &nbsp;
                        <div id="corpusName">
                            <input onChange={this.handleChange} name="corpusName" placeholder="Enter Corpus Name"/>
                        </div>
                        <table className="table table-hover tableBody t1">
                        &nbsp;
                            <thead className="table-light">
                                <tr>
                                    <th className="cell-align-middle centered tableHeader">File</th>
                                    <th className="cell-align-middle centered tableHeader">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.props.files).length === 0 ?
                                    <tr>
                                        <td></td>
                                    </tr>
                                    : this.renderTable()} 
                            </tbody>
                        </table>

                        <div className="modeBtn">
                            <button className="right btn-forward-doc btn" onClick={() => {this.props.nextPage(); this.props.saveCorpusName(this.state.corpusName);}}> Forward </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Documents;