import React from 'react';

class Load extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="page">
                <div className="pageBox">
                    <button onClick={() => this.props.loaded(false)} className="btn">
                        Create a new Taxonomy
                    </button>
                    <button onClick={() => this.props.loaded(true)} className="btn">
                        Load from Taxonomy
                    </button>
                </div> 
            </div>
        )
    }
}


export default Load;