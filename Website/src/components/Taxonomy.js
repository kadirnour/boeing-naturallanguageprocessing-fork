import React from 'react';
import ModalPopup from './modal_relationship_type';
import Graph from 'vis-react';
import download from 'downloadjs';
import html2canvas from "html2canvas";
//import ModalConfirmation from './modal_confirmation'

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
Function: Taxonomy Class
Description: Contains functions relating to graph and constructor
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
    Function: componentDidMount
    Description: Pushes nodes, graph and relationshiptypes into components
    Returns: Void
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
    Function: isShowPopup
    Description: 
    Returns: Void
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
    Function: checkLineExists
    Description: Checks if line exists between node A and node B and
    sets exists to true or false.
    Returns: Void
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
    Function: renderRelationshipTypes
    Description: Renders relationship types to the table.
    Returns: table
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    renderRelationshipTypes = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.state.relationshipTypes).length; r++) {
            table.push( // Each table row is clickable to edit the relationship type (name and color)
                <tr key={r} className="weight centered" onClick={() => this.isShowPopup(true, "editRelationshipType", r)}>
                    <td className="table-data">
                        {Object.keys(this.state.relationshipTypes[r])}
                    </td>
                    <td className="table-data" style={{ color: Object.values(this.state.relationshipTypes[r]) }}>
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
    Function: createRelationshipType
    Description: if the relations type does not exist, function creates
    the new relationship type and pushes it to relationshipTypes
    Returns: Void
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
    Function: createRelationship
    Description: Draws the relationship from node a and nod b and saves the
    result.
    Returns: Void
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
    Function: checkRelationshipExists
    Description: Check that the relationship is empty but exists return true
    or check that ther is an non empty relationship. Otherwise we return false.
    Returns: boolean value (true, false)
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
    Function: editRelationshipType
    Description: Edits relationship type by calling update, then saves
    the taxonomy.
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    editRelationshipType = (color, relationship) => {
        this.updateRelationshipType(color, relationship) // Updates the graph
        let newrelationshipTypes = [...this.state.relationshipTypes] // Updates the state
        newrelationshipTypes[this.state.row] = {[relationship]: color}
        this.props.saveTaxonomy(this.state.graph, newrelationshipTypes)
        this.setState({relationshipTypes: newrelationshipTypes})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: updateRelationshipType
    Description: saves the new graph/edges and relationships
    by copying and modifying that new graph then putting that 
    into the state.
    Returns: Void
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
    Function: deleteRelationshipType
    Description: 
    Returns: Void
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
    Function: deleteEdge
    Description: Deletes the edges by splicing by the two ends of the relationship
    then saving result
    Returns: Void
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
    Function: saveRelationships
    Description: Sends relationship data to the flask route.
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    saveRelationships = () => {
        
        this.isShowPopup(true, "confirm", -1)
        
    }

    confirmSave = () => {
        this.props.saveRelationships(this.state.graph.edges, this.state.graph.nodes, this.state.relationshipTypes)
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: getNouns
    Description: gets terms for the term pop up
    Returns: Void
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
    Function: Screenshot
    Description: Takes the screenshot them downlads that result
    as a png file
    Returns: Void 
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    
    Screenshot = () =>{
        html2canvas(document.getElementById("graphbox"), {
            //allowTaint: true,
            //useCORS: true,
          })
          .then(function (canvas) {
            // It will return a canvas element
            let image = canvas.toDataURL("image/png");
            download(image, "relationship.png", "text/png")
          })
          .catch((e) => {
            // Handle errors
            console.log(e);
          });
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: resnder
    Description: HTML script that vuilds the page
    Returns: HTML script
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    render() {
        return (
            <div className="section">
                <div className="container">
                    <div className="taxonomy-wrapper">
                        <ModalPopup showModalPopup={this.state.showModalPopup}
                            confirmSave={this.confirmSave}
                            type={this.state.type}
                            onPopupClose={this.isShowPopup}
                            relationshipTypes={this.state.relationshipTypes}
                            createRelationshipType={this.createRelationshipType}
                            createRelationship={this.createRelationship}
                            editRelationshipType={this.editRelationshipType}
                            deleteRelationshipType={this.deleteRelationshipType}
                            row={this.state.row}
                            nouns={this.state.nouns}
                            label={this.state.label}
                        />
                        <div className="taxonomy-header">
                            <h2 className="pageTitle">
                                Taxonomy Relationships
                            </h2>
                        </div>
                        <div className="taxonomy-content-box">
                            <div id='graphbox' className="taxonomy-terms-box">
                                    <div className="taxonomy-terms-box--left">
                                        <h6 className="taxonomy-sub-header">
                                            Hold ctrl or long-click to select second node
                                        </h6>
                                        <div className="taxonomy-graph-box" id='taxgraphbox'>
                                            <Graph key={this.state.graphID} graph={this.state.graph} options={options} events={this.state.events} style={{height: "100%"}}/>
                                        </div>
                                    </div>
                                    <div className="taxonomy-terms-box--center">
                                        <h6 className="taxonomy--center-sub-header centered"> Edit Relationships </h6>
                                        <button className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "newRelationshipType", -1)}>
                                            Create New Relationship Type
                                        </button>
                                        {this.state.nodes.length == 2 ?
                                            this.state.relationshipTypes.length == 0 ?
                                                <button disabled={true} className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "newRelationshipLine", -1)}>
                                                    Create New Relationship
                                                </button> 
                                                :
                                                <button className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "newRelationshipLine", -1)}>
                                                    Create New Relationship
                                                </button>
                                            : 
                                            <button disabled={true} className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "newRelationshipLine", -1)}>
                                                Create New Relationship
                                            </button>
                                        }

                                        {this.state.nodes.length == 1 ?
                                            <button className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                                See Nouns
                                            </button>
                                            : 
                                            <button disabled={true} className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                                See Nouns
                                            </button>
                                        }

                                        {this.state.nodes.length == 2 ?
                                            this.state.exists == false ?
                                                <button disabled={true} className="button taxonomy__buttons" onClick={() => this.deleteEdge()}>
                                                    Delete Relationship?
                                                </button> 
                                                :
                                                <button className="button taxonomy__buttons" onClick={() => this.deleteEdge()}>
                                                    Delete Relationship?
                                                </button>
                                            : 
                                            <button disabled={true} className="button taxonomy__buttons" onClick={() => this.deleteEdge()}>
                                                Delete Relationship?
                                            </button>
                                        }

                                        <button className="button taxonomy__buttons" onClick={() => this.saveRelationships()}>
                                            Save Relationship
                                        </button>

                                        <button className="button taxonomy__buttons" onClick={() => this.Screenshot()}>
                                            Take Screenshot
                                        </button>
                                    </div>



                                    <div className="taxonomy-terms-box--right">
                                        <h6 className="taxonomy-sub-header">
                                            Click to Edit
                                        </h6>
                                        <table className="table table-head">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="centered table-header">
                                                        Relationship
                                                    </th>
                                                    <th className="centered table-header">
                                                        Color
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-body--taxonomy">
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

                            <div className="page-button-box">
                                <button className="button__small taxonomy__page-buttons" onClick={() => this.props.prevPage()}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Taxonomy