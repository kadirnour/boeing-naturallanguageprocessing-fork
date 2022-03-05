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
        for (let r = 0; r < Object.keys(this.props.filesList).length; r++) {
          table.push(
            <tr key = {r} className={"weight" + (this.disabledBtn(r) === true ? " weight-selected2" : "")}>
                <td className="centered">
                  {Object.keys(this.props.filesList)[r] + Object.values(this.props.filesList)[r]}
                </td>
                <td className="centered">
                    {this.disabledBtn(r) ?
                        null
                        :
                        <button className="btn" onClick={() => this.props.addFile(r)}>
                            Add
                        </button>
                    }
                    {this.disabledBtn(r) ?
                        <button className="btn-delete" onClick={() => this.props.deleteFile(r)}>
                            Delete
                        </button>
                        :
                        null
                    }
                </td>
            </tr>
          )
        }
        return table;
    }

    disabledBtn = (r) => {
        if (Object.keys(this.props.filesList)[r] in this.props.files){
            return true
        } 
        return false
    }
    
    render() {
        return (
            <div className="page">
                <h2 className="pageTitle"> Step 1: Document Corpus </h2>
                <div className="pageBox">
                    <div className="documentUploadSection">
                        {this.props.load ?
                            <h3 className="pageTitle"> Load Taxonomy </h3>
                            :
                            <h3 className="pageTitle"> Create a New Taxonomy </h3>
                        }
                        {this.props.load ? 
                            <></>
                            :
                            <>
                                <div className="modeBtn">
                                    &nbsp;&nbsp;
                                    <input onChange={this.handleChange} name="input" placeholder="Enter Input Directory" size="80"/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn" onClick={() => this.submitInput()}> Enter Input: </button>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn" onClick={() => this.recommend()}> Recommendation: </button>
                                    &nbsp; */}
                                    <div>
                                        <h7>&nbsp;&nbsp;example: C:\Users\user\OneDrive\Desktop\boeing-naturallanguageprocessing\Parser\data</h7>
                                    </div> 
                                </div>
                                <div className="folderLocation">
                                    &nbsp;
                                    Input Location:
                                    &nbsp;
                                    {this.props.oldInput}
                                </div>
                            </>
                        }
                        
                        {this.props.load ? 
                            <>
                                &nbsp;
                                <div className="modeBtn">
                                    &nbsp;&nbsp;
                                    <input onChange={this.handleChange} name="output" placeholder="Enter Location of Taxonomy" size="80"/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn" onClick={() => this.submitOutput()}> Enter Location: </button>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn" onClick={() => this.recommendOut()}> Recommendation: </button>
                                    &nbsp; */}
                                    <div>
                                        <h7>
                                            &nbsp;&nbsp;
                                            example: C:\Users\user\OneDrive\Desktop\boeing-naturallanguageprocessing\Parser\output
                                        </h7>
                                    </div> 
                                </div>
                                <div className="folderLocation">
                                    &nbsp;
                                    Taxonomy Location:
                                    &nbsp;
                                    {this.props.oldOutput}
                                </div>
                                &nbsp;
                                <div id="corpusName">
                                    &nbsp;&nbsp;
                                    <input onChange={this.handleChange} size="15" name="corpusName" placeholder="Enter Corpus Name"/>
                                    <div>
                                        <h7>
                                            &nbsp;&nbsp;
                                            *Defaults name to "corpus".
                                        </h7>
                                    </div> 
                                </div>
                            </>
                            :
                            <>
                                &nbsp;
                                <div className="modeBtn">
                                    &nbsp;&nbsp;
                                    <input onChange={this.handleChange} name="output" placeholder="Enter Output Directory" size="80"/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn" onClick={() => this.submitOutput()}> 
                                        Enter Output: 
                                    </button>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp;
                                    <button className="btn" onClick={() => this.recommendOut()}> Recommendation: </button>
                                    &nbsp; */}
                                    <div>
                                        <h7>
                                            &nbsp;&nbsp;
                                            example: C:\Users\user\OneDrive\Desktop\boeing-naturallanguageprocessing\Parser\output
                                        </h7>
                                    </div> 
                                </div>
                                <div className="folderLocation">
                                    &nbsp;
                                    Output Location:
                                    &nbsp;
                                    {this.props.oldOutput}
                                </div>
                                &nbsp;
                                <div id="corpusName">
                                    &nbsp;&nbsp;
                                    <input onChange={this.handleChange} size="15" name="corpusName" placeholder="Enter Corpus Name"/>
                                    <div>
                                        <h7>
                                            &nbsp;&nbsp;
                                            *Defaults name to "corpus". Will rewrite over files with same name.
                                        </h7>
                                    </div> 
                                </div>
                            </>
                        }

                        &nbsp;
                        {this.props.load ? 
                            <></>
                            :
                            <>
                                <div>
                                    &nbsp;&nbsp;
                                    <button className="btn-files" onClick={() => this.props.Files()}> 
                                        Refresh Files: 
                                    </button>
                                </div>
                                &nbsp;
                                <table className="table tableBody t1">
                                &nbsp;
                                    <thead className="table-light">
                                        <tr>
                                            <th className="cell-align-middle centered tableHeader">
                                                File
                                            </th>
                                            <th className="cell-align-middle centered tableHeader">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(this.props.filesList).length === 0 ?
                                            <tr>
                                                <td></td>
                                            </tr>
                                            : 
                                            this.renderTable()} 
                                    </tbody>
                                </table>
                            </>
                        }

                        <div className="modeBtn">
                            <button className="right btn-forward-doc btn" onClick={() => {this.props.nextPage(); this.props.saveCorpusName(this.state.corpusName);}}> Forward </button>
                        </div>
                        <div className="btnLeft">
                                    <button className="bottom3 btn" onClick={() => this.props.prevPage()}> 
                                        Back 
                                    </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Documents;