import React from 'react';

class Categories extends React.Component {

    render() {
        return (
            <div className="mode">
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
                        <button onClick={() => this.props.nextPage()}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Categories;