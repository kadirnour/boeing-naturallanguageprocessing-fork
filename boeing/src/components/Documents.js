import React from 'react';

class Documents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {inputConfirmed: ""}
    }

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    submitInput = () => {
        this.setState({inputConfirmed: this.state.input}, () =>
                        this.props.setInput(this.state.inputConfirmed))
    }

    render() {
        return (
            <div className="mode">
                <div className="modeBox">
                    <h1>
                        Step 1: Document Corpus
                    </h1>
                    <div className="modeBtn">
                        <input onChange={this.handleChange} name="input" placeholder="Enter Input Directory"/>
                        <button onClick={() => this.submitInput()}> Enter: </button>
                        {/* <button onClick={() => this.props.getFolder()}> Select Folder Directory: </button> */}
                    </div>
                    <div className="folderLocation">
                        Input Location:
                        &nbsp;
                        {this.state.inputConfirmed}
                    </div>
                    <div className="modeBtn">
                        <button onClick={() => this.props.nextPage()}> Forward </button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Documents;