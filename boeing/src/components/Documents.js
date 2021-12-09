import React from 'react';

class Documents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    submitInput = () => {
        this.props.setInput(this.state.input)
    }

    // Autocompletes output location to recommened location
    recommend = () => {
        this.props.setInput("C:\\Users\\blcsi\\OneDrive\\Desktop\\boeing-naturallanguageprocessing\\Parser\\data")
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
                            <button className="btn" onClick={() => this.submitInput()}> Enter: </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className="btn" onClick={() => this.recommend()}> Recommendation: </button>
                        </div>
                        <div className="folderLocation">
                            Input Location:
                            &nbsp;
                            {this.props.oldInput}
                        </div>
                        <div className="modeBtn">
                            <button className="right bottom1 btn" onClick={() => this.props.nextPage()}> Forward </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Documents;