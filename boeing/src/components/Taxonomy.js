import React from 'react';

class Taxonomy extends React.Component {

    render() {
        return (
            <div className="mode">
                <div className="modeBox">
                    <h1>
                        UNDER CONSTRUCTION
                    </h1>      
                    <div className="modeBtn">
                        <button onClick={() => this.props.prevPage()}> Back </button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Taxonomy;