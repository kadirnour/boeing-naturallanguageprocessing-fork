import React from 'react';

class Categories extends React.Component {

    render() {
        return (
            <div className="mode">
                <h5> Boeing Natural Processing Language Project </h5>
                <div className="outlineModeBox">
                <div className="modeBox">
                    <h1>
                        Step 3: Categories
                    </h1>
                    <div className="modeBtn">
                        <button onClick={() => this.props.getWeight()}> Get Weights: </button>
                    </div>
                    <table>
                        <thead className="table-light tableHead">
                            <tr>
                                <th>NOUN</th>
                                <th>FREQUENCY</th>
                                <th>WEIGHT</th>
                            </tr>
                        </thead>
                        <tbody className="tableBody">
                            {Object.keys(this.props.weights).length === 0 ?
                                <tr>
                                    <td></td>
                                </tr>
                                : this.props.renderTable()
                            } 
                        </tbody>
                    </table>
                    <div className="modeBtn">
                        <button onClick={() => this.props.prevPage()}> Back </button>
                        <button onClick={() => this.props.nextPage()}> Forward </button>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}


export default Categories;