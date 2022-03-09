import React from 'react';
import ModalPopup from './modal_relationship_type';
import Graph from 'vis-react';


//!! TODO: Create undo and redo array !!
//!! TODO: Fix bug where user slected 2 nodes, then holds ctrl and drags a third node
//!! TODO: Fix bug where user slected 2 nodes, one that had a relationship line, and one that does not
//!! Nodes and relationship names must be unique !!


/*##################################################################################
                                    Graph Options
###################################################################################*/
var options = { 
    layout: {
        hierarchical: false
    },
    edges: {
        color: '#000000'
    },
    interaction: { multiselect: true, hover: true}
};


/*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: 
Description:
Returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
class Taxonomy extends React.Component {
    constructor() {  
        super();  
        this.state = {  
            graphID: 0, // ID for graph. Whenever the graph is updated, needs a new graphID to display changes
            nodeID: 0, // ID for nodes
            relationshipTypes: [],
            showModalPopup: false,
            nodes: [], // List of currently selected nodes
            node1: -1, // First node selected (Needed for relationship line direction)
            node2: -1, // Second node selected (Needed for relationship line direction)
            type: "", // Type of modal to be opened
            graph: {
              nodes: [],
              edges: []
            },

            events: { // Logic for selecting nodes
              click: ({ nodes, edges }) => {
                    if(nodes.length == 2) { // Two nodes are selected
                        if(this.state.node1 == -1) { // Deals with bug where user drags a node instead of clicking and node is not added to nodes list
                            this.setState({node1: nodes[0]}) // Sets node1 to the first node in the list as default
                        }

                        let node2 = -1
                        for(let i = 0; i < nodes.length; i++) {  // Deals with bug where user drags a node instead of clicking and node is not added to nodes list
                            if(nodes[i] != this.state.node1) {
                                node2 = nodes[i] // Sets node2 to the other node in the list as default
                            }
                        }

                        this.setState({nodes: nodes,
                            node2: node2})
                        this.checkLineExists() // Used to determine if the delete relationship line button should be enabled/disabled

                        } else if (nodes.length == 1) { // Only the first node is selected
                            this.setState({nodes: nodes,
                                node1: nodes[0]})
                        } else { // No nodes are selected
                            this.setState({nodes: nodes})
                    }
              }
            }
        }  
    } 


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    componentDidMount() {
        if(this.props.graph.nodes.length == 0) {
            let nodes = []
            let newGraph = {...this.state.graph}
            let nodeID = this.state.nodeID

            for (let r = 0; r < Object.keys(this.props.categories).length; r++) { // Displays categories from last page as nodes in graph
                nodeID = nodeID + 1
                nodes.push({id: nodeID, label: Object.keys(this.props.categories)[r], color: '#e04141'})
            }

            newGraph.nodes = nodes
            this.setState({nodeID: nodeID,   //!!!!!! NEED TO REWORD NODEID, MIGHT NOT BE NECCESSARY
                graph: newGraph,
                graphID: this.state.graphID + 1})
        } else {
            this.setState({graph: this.props.graph,
                graphID: this.state.graphID + 1,
                relationshipTypes: this.props.relationshipTypes})
        }
  
    }

    /*##################################################################################
                                        Modal Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    isShowPopup = (status, type, r) => {  
        if (type == "nouns"){
            this.getNouns()
        }

        this.setState({showModalPopup: status,
            type: type,
            row: r});  
    };  

    /*##################################################################################
                                    Graph Functions
    ###################################################################################*/


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    checkLineExists = () =>   {
        let exists = "FALSE"
        if(this.state.graph.edges.length != 0) {
            for(let i = 0; i < this.state.graph.edges.length; i++) { 
                if((this.state.graph.edges[i].from == this.state.node1 || this.state.graph.edges[i].from == this.state.node2) && // Checks if there is a realtionship line between the two nodes
                    (this.state.graph.edges[i].to == this.state.node1 || this.state.graph.edges[i].to == this.state.node2)) {
                        exists = "TRUE"
                    }
            }
        }
        if (exists == "TRUE") {
            this.setState({exists: true})
        } else {
            this.setState({exists: false})
        }
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    renderRelationshipTypes = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.state.relationshipTypes).length; r++) {
            table.push( // Each table row is clickable to edit the relationship type (name and color)
                <tr key={r} className="centered" onClick={() => this.isShowPopup(true, "editRelationshipType", r)}>
                    <td>
                        {Object.keys(this.state.relationshipTypes[r])}
                    </td>
                    <td style={{ color: Object.values(this.state.relationshipTypes[r]) }}>
                        {Object.values(this.state.relationshipTypes[r])}
                    </td>
                </tr>
            )
        }
        return table;
    }


    /*##################################################################################
                                    Relationship Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    createRelationshipType = (color, relationship) => {
        if(!this.checkRelationshipExists(relationship)) {
            let newrelationshipTypes = [...this.state.relationshipTypes]
            newrelationshipTypes.push({[relationship]: color})
            this.props.saveTaxonomy(this.state.graph, newrelationshipTypes)
            this.setState({relationshipTypes: newrelationshipTypes})
        }
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    createRelationship = (color, relationship) => {
        let newEdges = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}

        for(let i = 0; i < this.state.graph.edges.length; i++) { // Removes edges if nodes already have an edge between them
            if(this.state.graph.edges[i].from == this.state.nodes[0] && this.state.graph.edges[i].to == this.state.nodes[1]
            || this.state.graph.edges[i].from == this.state.nodes[1] && this.state.graph.edges[i].to == this.state.nodes[0]) {
                newEdges.splice(i, 1)
            }
        }

        newEdges.push({from: this.state.node1, to: this.state.node2, color: color, width: 3, relationship: relationship})
        newGraph.edges = newEdges
        this.props.saveTaxonomy(newGraph, this.state.relationshipTypes)
        this.setState({graph: newGraph,
            graphID: this.state.graphID + 1,
            nodes: []})            
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    checkRelationshipExists = (relationship) => {
        if(relationship.toString() == "") {
            return true
        }

        if(this.state.relationshipTypes.length != 0) {
            for(let i = 0; i < this.state.relationshipTypes.length; i++) {
                if(Object.keys(this.state.relationshipTypes[i]) == relationship.toString()) {
                    return true
                }
            }
        }
        return false
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    editRelationshipType = (color, relationship) => {
        this.updateRelationshipType(color, relationship) // Updates the graph
        let newrelationshipTypes = [...this.state.relationshipTypes] // Updates the state
        newrelationshipTypes[this.state.row] = {[relationship]: color}
        this.props.saveTaxonomy(this.state.graph, newrelationshipTypes)
        this.setState({relationshipTypes: newrelationshipTypes})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    updateRelationshipType = (color, relationship) => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}
        let oldRelationship = Object.keys(this.state.relationshipTypes[this.state.row]) // Name of old relationship. Used to index which relationship lines need to be updated.
        for(let i = 0; i < this.state.graph.edges.length; i++) {
            if(this.state.graph.edges[i].relationship == oldRelationship) {
                edgesCopy[i].color = color
                edgesCopy[i].relationship = relationship
            }
        }
        newGraph.edges = edgesCopy
        this.setState({graph: newGraph,
            graphID: this.state.graphID + 1})
    }
    

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    deleteRelationshipType = () => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}
        let oldRelationship = Object.keys(this.state.relationshipTypes[this.state.row]) // Name of old relationship. Used to index which relationship lines need to be deleted.

        edgesCopy = edgesCopy.filter(a => a.relationship !== oldRelationship.toString())
        newGraph.edges = edgesCopy

        let newrelationshipTypes = [...this.state.relationshipTypes]
        newrelationshipTypes.splice(this.state.row, 1)

        this.props.saveTaxonomy(newGraph, newrelationshipTypes)

        this.setState({relationshipTypes: newrelationshipTypes,
            graph: newGraph,
            graphID: this.state.graphID + 1})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    deleteEdge = () => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}

        for(let i = 0; i < this.state.graph.edges.length; i++) {
            if((this.state.graph.edges[i].from == this.state.node1 || this.state.graph.edges[i].from == this.state.node2)
                && (this.state.graph.edges[i].to == this.state.node1 || this.state.graph.edges[i].to == this.state.node2)) {
                    edgesCopy.splice(i, 1)
                }
        }
        newGraph.edges = edgesCopy
        this.props.saveTaxonomy(newGraph, this.state.relationshipTypes)
        this.setState({graph: newGraph,
            nodes: [],
            graphID: this.state.graphID + 1})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    saveRelationships = () => {
        this.props.saveRelationships(this.state.graph.edges, this.state.graph.nodes, this.state.relationshipTypes)
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    getNouns = () => {
        let label = ""
        for(let i=0; i<this.state.graph.nodes.length; i++) {
            if(this.state.graph.nodes[i].id == this.state.nodes[0]){
                label = this.state.graph.nodes[i].label
            }
        }
        this.setState({label: label,
            nouns: this.props.categories[label]})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: 
    Description:
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    render() {
        return (
            <div className = "page">
                <ModalPopup showModalPopup={this.state.showModalPopup}  
                    type={this.state.type}
                    onPopupClose={this.isShowPopup}
                    relationshipTypes={this.state.relationshipTypes}
                    createRelationshipType={this.createRelationshipType}
                    createRelationship={this.createRelationship}
                    editRelationshipType={this.editRelationshipType}
                    deleteRelationshipType={this.deleteRelationshipType}
                    row={this.state.row}
                    nouns={this.state.nouns}
                    label={this.state.label}/>
                <div className="pageBox">
                    <div className="categoriesUploadSection">
                        <div className="categoriesLeft centered">
                            Hold ctrl or long-click to select second node
                            <Graph key={this.state.graphID} graph={this.state.graph} options={options} events={this.state.events} style={{height: "435px"}}/>
                        </div>
                        <div className="categoriesCenter">
                            <button className="btn" onClick={() => this.isShowPopup(true, "newRelationshipType", -1)}>
                                Create New Relationship Type
                            </button>
                            
                            {this.state.nodes.length == 2 ?
                                this.state.relationshipTypes.length == 0 ?
                                    <button disabled={true} className="btn" onClick={() => this.isShowPopup(true, "newRelationshipLine", -1)}>
                                        Create New Relationship
                                    </button> 
                                    :
                                    <button className="btn" onClick={() => this.isShowPopup(true, "newRelationshipLine", -1)}>
                                        Create New Relationship
                                    </button>
                                : 
                                <button disabled={true} className="btn" onClick={() => this.isShowPopup(true, "newRelationshipLine", -1)}>
                                    Create New Relationship
                                </button>
                            }

                            {this.state.nodes.length == 1 ?
                                <button className="btn" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                    See Nouns
                                </button>
                                : 
                                <button disabled={true} className="btn" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                    See Nouns
                                </button>
                            }

                            {this.state.nodes.length == 2 ?
                                this.state.exists == false ?
                                    <button disabled={true} className="btn" onClick={() => this.deleteEdge()}>
                                        Delete Relationship?
                                    </button> 
                                    :
                                    <button className="btn" onClick={() => this.deleteEdge()}>
                                        Delete Relationship?
                                    </button>
                                : 
                                <button disabled={true} className="btn" onClick={() => this.deleteEdge()}>
                                    Delete Relationship?
                                </button>
                            }

                            <button className="btn" onClick={() => this.saveRelationships()}>
                                Save Relationship
                            </button>
                        </div>

                        <div className="categoriesRight centered">
                            Click to edit
                            <table className="table table-hover tableBody tl">
                                <thead className="table-light">
                                    <tr>
                                        <th className="cell-align-middle centered tableHeader">
                                            Relationship
                                        </th>
                                        <th className="cell-align-middle centered tableHeader">
                                            Color
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(this.state.relationshipTypes).length === 0 ?
                                        <tr>
                                            <td></td>
                                        </tr>
                                        : 
                                        this.renderRelationshipTypes()
                                    } 
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="modeBtn">
                        <button className="btn bottom4" onClick={() => this.props.prevPage()}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Taxonomy