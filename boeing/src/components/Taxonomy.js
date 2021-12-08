import React from 'react';

class Taxonomy extends React.Component {

    /**
     * Contains page where user can look at and manage generalized taxonomies.
     * @returns taxonomy page
     */
    render() {
        return (
            <div className="mode">
                <div className="outlineModeBox">
                <div className="modeBox">
                    <h1>
                        UNDER CONSTRUCTION
                    </h1>      
                    <div className="modeBtn">
                        <button onClick={() => this.props.prevPage()}> Back </button>
                    </div>
                </div>
                </div>
                <h5> Boeing Natural Processing Language Project </h5>
            </div>
        )
    }
}


export default Taxonomy;