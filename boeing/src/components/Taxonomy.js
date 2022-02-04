import React from 'react';
import ModalPopup from './modal_relationship_type';
//import example from '../images/taxonomy_example.png';

import Graph from 'vis-react';

var options = { 
    layout: {
        hierarchical: true
    },
    edges: {
        color: '#000000'
    },
    interaction: { multiselect: true, hover: true}
};

class Taxonomy extends React.Component {

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //                       Modal Popup Functions
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Displays modal popup
    isShowPopup = (status, type, r) => {  
        this.setState({ showModalPopup: status,
                        type: type,
                        row: r});  
    };  

    constructor() {  
        super();  
        this.state = {  
            newID: 0,
            counter: 0,
            relationships: [],
            showModalPopup: false,
            nodes: [],
            node1: -1,
            node2: -1,
            type: "",
            graph: {
              nodes: [
                // { id: 1, label: "Node 1", color: "#e04141" },
                // { id: 2, label: "Node 2", color: "#e09c41" }
              ],
              edges: [
                // { from: 1, to: 2 },
                // { from: 1, to: 3 }
              ]
            },
            events: {
              click: ({ nodes, edges }) => { // Logic for directional arrows
                  if(nodes.length == 2) {

                    if(this.state.node1 == -1) { // !! THERE IS A BUG WHEN DRAGING A NODE, WILL SELECT BUT NOT INDICATE THIS IN STATE (Defaults to making one of the nodes node1) !!
                        this.setState({node1: nodes[0]})
                    }
                    
                    let node2 = -1
                    for(let i = 0; i < nodes.length; i++) { // Gets the second node
                        if(nodes[i] != this.state.node1) {
                            node2 = nodes[i]
                        }
                    }

                    this.setState({nodes: nodes,
                                   node2: node2})

                  } else if (nodes.length == 1) {
                    this.setState({nodes: nodes,
                                   node1: nodes[0]})
                  } else {
                    this.setState({nodes: nodes})
                  }
              }
            }
        }  
    } 

    componentDidMount() {
        let nodes = []
        let newGraph = {...this.state.graph}
        let counter = this.state.counter

        for (let r = 0; r < Object.keys(this.props.categories).length; r++) {
            counter = counter + 1
            nodes.push({id: counter, label: Object.keys(this.props.categories)[r], color: '#e04141'})
        }

        newGraph.nodes = nodes
        
        this.setState({
            counter: counter,
            graph: newGraph,
            newID: this.state.newID + 1
        })         
    }

    createNode = () => {
        let counter = this.state.counter + 1
        let newNodes = [...this.state.graph.nodes]
        let newGraph = {...this.state.graph}

        newNodes.push({id: counter, label: `Node ${counter}`, color: '#e04141'})

        newGraph.nodes = newNodes

        this.setState({
            counter: counter,
            graph: newGraph,
            newID: this.state.newID + 1
        })         
    }

    createRelationship = (color, relationship) => {
        let newEdges = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}


        for(let i = 0; i < this.state.graph.edges.length; i++) { // Removes edges if they already have an edge between them
            if(this.state.graph.edges[i].from == this.state.nodes[0] && this.state.graph.edges[i].to == this.state.nodes[1]
            || this.state.graph.edges[i].from == this.state.nodes[1] && this.state.graph.edges[i].to == this.state.nodes[0]) {
                newEdges.splice(i, 1)
            }
        }


        newEdges.push({from: this.state.node1, to: this.state.node2, color: color, width: 3, relationship: relationship})

        newGraph.edges = newEdges

        this.setState({
            graph: newGraph,
            newID: this.state.newID + 1,
            nodes: []
        })            
    }

    createRelationshipType = (color, relationship) => {
        let newRelationships = [...this.state.relationships]
        newRelationships.push({[relationship]: color})
        this.setState({relationships: newRelationships})
    }

    renderRelationshipTypes = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.state.relationships).length; r++) {
            table.push(
                <tr key={r} className="centered" onClick={() => this.isShowPopup(true, "edit", r)}>
                    <td>
                        {Object.keys(this.state.relationships[r])}
                    </td>
                    <td style={{ color: Object.values(this.state.relationships[r]) }}>
                        {Object.values(this.state.relationships[r])}
                    </td>
                </tr>
            )
        }
        return table;
    }

    editRelationship = (color, relationship) => {

        this.updateRelationships(color)

        let newRelationships = [...this.state.relationships]
        newRelationships[this.state.row] = {[relationship]: color}
        this.setState({relationships: newRelationships})
    }

    updateRelationships = (color) => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}

        for(let i = 0; i < edgesCopy.length; i++) {
            if(edgesCopy[i].color == Object.values(this.state.relationships[this.state.row])) {
                edgesCopy[i].color = color
            }
        }

        newGraph.edges = edgesCopy

        this.setState({graph: newGraph,
                       newID: this.state.newID + 1})
    }

    render() {
        return (
            <div className = "page">
                <ModalPopup showModalPopup={this.state.showModalPopup}  
                            type={this.state.type}
                            onPopupClose={this.isShowPopup}
                            relationships={this.state.relationships}
                            createRelationshipType={this.createRelationshipType}
                            createRelationship={this.createRelationship}
                            editRelationship={this.editRelationship}
                />
                <div className="pageBox">
                    <div className="categoriesUploadSection">
                        
                        <div className="categoriesLeft">
                            <Graph key={this.state.newID} graph={this.state.graph} options={options} events={this.state.events} style={{ height: "435px" }} />
                        </div>

                        <div className="categoriesCenter">
                            <button className="btn" onClick={() => this.createNode()}>Create New Node</button>

                            <button className="btn" onClick={() => this.isShowPopup(true, "relationship", -1)}>Create New Relationship Type</button>

                            {this.state.nodes.length == 2 ?
                                this.state.relationships.length == 0 ?
                                    null :
                                    <button className="btn" onClick={() => this.isShowPopup(true, "color", -1)}>Create New Relationship</button>
                                : null
                            }
                        </div>

                        <div className="categoriesRight">
                            <table className="table table-hover tableBody tl">
                                <thead className="table-light">
                                    <tr>
                                        <th className="cell-align-middle centered tableHeader">Relationship</th>
                                        <th className="cell-align-middle centered tableHeader">Color</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(this.state.relationships).length === 0 ?
                                        <tr>
                                            <td></td>
                                        </tr>
                                        : this.renderRelationshipTypes()
                                    } 
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                    <div className="modeBtn">
                                <button className="btn bottom4" onClick={() => this.props.prevPage()}> Back </button>
                    </div>
                </div>
            </div>
        )
    }

}

export default Taxonomy