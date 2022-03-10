import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder, faFile, faArrowsRotate, faPlus, faMinus, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'

class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {corpusName: 'corpus'}
    }


    //!!!!!!!!!!! ADD PAGINATION AND ADD ALL BUTTON TO TABLE !!!!!!!!!!!!!!!!!!!!!!!!!!!


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
        for (let r = 0; r < Object.keys(this.props.filesList).length; r++) {
          table.push(
            <tr key = {r} className={"table-row--no-hover" + (this.disabledBtn(r) === true ? " table-row--selected" : "")}>
                
                <td>
                    {Object.keys(this.props.filesList)[r] + Object.values(this.props.filesList)[r]}
                </td>
                <td>
                    {this.disabledBtn(r) ?
                        null
                        :
                        <button className="button" onClick={() => this.props.addFile(r)}>
                            <FontAwesomeIcon icon={faPlus}/> &nbsp; 
                            Add
                        </button>
                    }
                    {this.disabledBtn(r) ?
                        <button className="button" onClick={() => this.props.deleteFile(r)}>
                            <FontAwesomeIcon icon={faMinus}/> &nbsp; 
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


    /*##################################################################################
                                        Page Functions
    ###################################################################################*/
    
    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    submitInput = () => {
        this.props.setInput(this.state.input)
    }

    
    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    submitOutput = () => {
        this.props.setOutput(this.state.output)
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    submitCorpus = () => {
        this.props.saveCorpusName(this.state.corpusName)
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    disabledBtn = (r) => {
        if (Object.keys(this.props.filesList)[r] in this.props.files){
            return true
        } 
        return false
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
                    <div className="document-wrapper">
                        {this.props.load ?
                            <h2 className="document-header">
                                Load From Taxonomy
                            </h2>
                            :
                            <h2 className="document-header">
                                Create a New Taxonomy
                            </h2>
                        }
                        <div className="document-content-box">
                            <div className="document-content-box--centered">
                                {this.props.load ? 
                                    <></>
                                    :
                                    <> &nbsp;
                                        <div className="document-input-box"> &nbsp;&nbsp;
                                            <input onChange={this.handleChange} name="input" 
                                                placeholder="C:\Users\user\OneDrive\Desktop\boeing-naturallanguageprocessing\Data\Input" size="75"/> &nbsp;&nbsp;&nbsp;
                                            <button className="button" onClick={() => this.submitInput()}>
                                                <FontAwesomeIcon icon={faFolder}/> &nbsp;
                                                Submit Input Folder:
                                            </button>
                                            <div className="document-location-box"> &nbsp; 
                                                Input Location: {this.props.oldInput}
                                            </div>   
                                        </div>
                                        <hr className="hr"/>
                                    </>
                                }
                                {this.props.load ? 
                                    
                                    <> &nbsp;
                                        <div className="document-input-box">
                                            &nbsp;&nbsp;
                                            <input onChange={this.handleChange} name="output" 
                                                placeholder="C:\Users\user\OneDrive\Desktop\boeing-naturallanguageprocessing\Data\Output" size="75"/> &nbsp;&nbsp;&nbsp;
                                            <button className="button" onClick={() => this.submitOutput()}>
                                                <FontAwesomeIcon icon={faFolder}/> &nbsp;
                                                Submit Output Folder:
                                            </button>
                                            <div className="document-location-box">
                                                &nbsp; Output Location: {this.props.oldOutput}
                                            </div>
                                        </div>
                                        <hr className="hr"/>
                                        <div className="document-input-box"> &nbsp;&nbsp;
                                            <input onChange={this.handleChange} size="75" name="corpusName" 
                                                placeholder="Will write over files with the same name"/> &nbsp;&nbsp;&nbsp;
                                            <button className="button" onClick={() => this.submitCorpus()}>
                                                <FontAwesomeIcon icon={faFile}/> &nbsp; 
                                                Submit Corpus Name: 
                                            </button>
                                            <div className="document-location-box"> &nbsp; 
                                                Corpus Name: {this.props.corpusName}
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="document-input-box"> &nbsp;&nbsp;
                                            <input onChange={this.handleChange} name="output" 
                                                placeholder="C:\Users\user\OneDrive\Desktop\boeing-naturallanguageprocessing\Data\Output" size="75"/> &nbsp;&nbsp;&nbsp;
                                            <button className="button" onClick={() => this.submitOutput()}>
                                                <FontAwesomeIcon icon={faFolder}/> &nbsp; 
                                                Submit Output Folder: 
                                            </button>
                                            <div className="document-location-box"> &nbsp; 
                                                Output Location: {this.props.oldOutput}
                                            </div>
                                        </div>
                                        <hr class="hr"/>
                                        <div className="document-input-box"> &nbsp;&nbsp;
                                            <input onChange={this.handleChange} size="75" name="corpusName" 
                                                placeholder="Will write over files with the same name"/> &nbsp;&nbsp;&nbsp;
                                            <button className="button" onClick={() => this.submitCorpus()}> 
                                                <FontAwesomeIcon icon={faFile}/> &nbsp; 
                                                Submit Corpus Name: 
                                            </button>
                                            <div className="document-location-box"> &nbsp; 
                                                Corpus Name: {this.props.corpusName}
                                            </div>
                                        </div>
                                    </>
                                }
                                <hr className="hr"/>
                                {this.props.load ? 
                                    <></>
                                    :
                                    <>
                                        <div> &nbsp;&nbsp;
                                            <button className="button" onClick={() => this.props.Files()}> 
                                                <FontAwesomeIcon icon={faArrowsRotate}/> &nbsp; 
                                                Get Files From Input Folder: 
                                            </button>
                                        </div>
                                        <div className="table-box--documents">
                                            <table className="table table-head"> &nbsp;
                                                <thead className="table-light">
                                                    <tr>
                                                        <th className="table-header">
                                                            File
                                                        </th>
                                                        <th className="table-header">
                                                            Add/ Remove
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.keys(this.props.filesList).length === 0 ?
                                                        <tr>
                                                            <td></td>
                                                        </tr>
                                                        : 
                                                        this.renderTable()
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="page-button-box">
                                <button className="button__small" onClick={() => this.props.prevPage()}> 
                                    <FontAwesomeIcon icon={faBackward}/> &nbsp; 
                                    Back 
                                </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button className="button__small" onClick={() => {this.props.nextPage()}}>
                                    Forward  &nbsp;
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


export default Documents;