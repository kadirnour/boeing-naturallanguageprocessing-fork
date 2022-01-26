import React from 'react';
import example from '../images/taxonomy_example.png';

class Taxonomy extends React.Component {

     

    render() {
        return (
            <div className="page">
                <h2 className="pageTitle"> Step 4: Taxonomy </h2>
                <div className="pageBox">
                <h6> Under Construction </h6>
                <div className="modeBtn">
                            <button className="btn bottom6" onClick={() => this.generateTaxonomy()}> generateTaxonomy </button>
                        </div>
                    <div className="categoriesUploadSection2">
                        <div>
                            <img className="example" src={example}/>
                        </div>    
                        <div className="modeBtn">
                            <button className="btn bottom6" onClick={() => this.props.prevPage()}> Back </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Taxonomy;