import React from 'react';

class Terms extends React.Component {

    constructor(props) {
        super(props);
        this.state = {outputConfirmed: ""}
    }

    submitOutput = () => {
        this.setState({outputConfirmed: this.state.output}, () =>
                        this.props.setOutput(this.state.outputConfirmed))
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    render() {
        return (
            <div className="mode">
                <div className="modeBox">
                    <h1>
                        Step 2: Term Extraction
                    </h1>
                    {/* <div className="modeBtn">
                        <button onClick={() => this.props.getFolder()}> Select Folder Directory: </button>
                    </div>
                    <div className="folderLocation">
                        FOLDER LOCATION:
                        &nbsp;
                        {Object.keys(this.props.folder) === 0 ?
                            null : 
                            this.props.folder.directory }
                    </div> */}

                    <div className="modeBtn">
                        <input onChange={this.handleChange} name="output" placeholder="Enter Output Directory"/>
                        <button onClick={() => this.submitOutput()}> Enter: </button>
                        {/* <button onClick={() => this.props.getFolder()}> Select Folder Directory: </button> */}
                    </div>
                    <div className="folderLocation">
                        Output Location:
                        &nbsp;
                        {this.state.outputConfirmed}
                    </div>

                    <div className="modeBtn">
                        <button onClick={() => this.props.Parser()}> Run Parser: </button>
                    </div>
                    <table>
                        <thead className="table-light tableHead">
                            <tr>
                                <th>Term</th>
                                <th>FREQUENCY</th>
                            </tr>
                        </thead>
                        <tbody className="tableBody">
                            {Object.keys(this.props.dict).length === 0 ?
                                <tr>
                                    <td></td>
                                </tr>
                                : this.props.renderTable()} 
                        </tbody>
                    </table>
                    <div className="modeBtn">
                        <button onClick={() => this.props.prevPage()}> Back </button>
                        <button onClick={() =>  this.props.nextPage()}> Forward </button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Terms;