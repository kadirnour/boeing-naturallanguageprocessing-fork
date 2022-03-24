import React from 'react';
import ModalPopup from './modal_relationship_type';
import Graph from 'vis-react';
import download from 'downloadjs';
import html2canvas from "html2canvas";
//import ModalConfirmation from './modal_confirmation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faFileArrowDown, faFileLines, faTrash, faCirclePlus, faPlus }
    from '@fortawesome/free-solid-svg-icons'

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
        color: '#000000',
    },
    interaction: {
        multiselect: true, 
        hover: true, 
        selectConnectedEdges: false, 
        hoverConnectedEdges: false, 
        hoverEdges: true }
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
            edgeTypes: [],
            showModalPopup: false,
            nodes: [], // List of currently selected nodes
            node1: -1, // First node selected (Needed for relationship line direction)
            node2: -1, // Second node selected (Needed for relationship line direction)
            edges: [], // List of selected edges
            type: "", // Type of modal to be opened
            graph: {
              nodes: [],
              edges: []
            },

            events: { // Logic for selecting nodes
                click: ({ nodes, edges }) => {
                    this.setState({edges: edges}) // Adds selected edges to state
                    if(nodes.length == 2) { // Two nodes are already selected
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
                        //this.checkLineExists() // Used to determine if the delete relationship line button should be enabled/disabled

                    } else if (nodes.length == 1) { // One node is already selected
                        this.setState({nodes: nodes,
                            node1: nodes[0]})
                    } else { // No nodes are already selected
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
                edgeTypes: this.props.edgeTypes})
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
    Function: renderRelationshipTypes
    Description: Renders relationship types to the table.
    Returns: table
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    renderRelationshipTypes = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.state.edgeTypes).length; r++) {
            table.push( // Each table row is clickable to edit the relationship type (name and color)
                <tr key={r} className="table-row" onClick={() => this.isShowPopup(true, "editEdgeType", r)}>
                    <td>
                        {Object.keys(this.state.edgeTypes[r])}
                    </td>
                    <td style={{ color: Object.values(this.state.edgeTypes[r]) }}>
                        {Object.values(this.state.edgeTypes[r])}
                    </td>
                </tr>
            )
        }
        return table;
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: displaySelectedNodes
    Description: 
    Returns: 
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    displaySelectedNodes = () => {
        let result = ""
        for(let i = 0; i < this.state.nodes.length; i++) {
            result += this.state.nodes[i]  + ", "
        }
        return result.slice(0, result.length - 2)
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: displaySelectedEdges
    Description: 
    Returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    displaySelectedEdges = () => {
        let result = ""
        for(let i = 0; i < this.state.edges.length; i++) {
            for(let g = 0; g < this.state.graph.edges.length; g++) {
                if(this.state.edges[i] == this.state.graph.edges[g].id) {
                    result += this.state.graph.edges[g].from.toString() + ">" + this.state.graph.edges[g].to.toString() + ", "
                }
            }
        }
        return result.slice(0, result.length - 2)
    }


    /*##################################################################################
                                    Relationship Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: createEdgeType
    Description: if the relations type does not exist, function creates
    the new relationship type and pushes it to relationshipTypes
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    createEdgeType = (color, relationship) => {
        if(!this.checkEdgeExists(relationship)) {
            let newrEdgeTypes = [...this.state.edgeTypes]
            newrEdgeTypes.push({[relationship]: color})
            this.props.saveTaxonomy(this.state.graph, newrEdgeTypes)
            this.setState({edgeTypes: newrEdgeTypes})
        }
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: createEdge
    Description: Draws the relationship from node a and nod b and saves the
    result.
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    createEdge = (color, relationship) => {
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
        this.props.saveTaxonomy(newGraph, this.state.edgeTypes)
        this.setState({graph: newGraph,
            graphID: this.state.graphID + 1,
            nodes: []})            
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: checkEdgeExists
    Description: Check that the relationship is empty but exists return true
    or check that there is an non empty relationship. Otherwise we return false.
    Returns: boolean value (true, false)
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    checkEdgeExists = (relationship) => {
        if(relationship.toString() == "") {
            return true
        }

        if(this.state.edgeTypes.length != 0) {
            for(let i = 0; i < this.state.edgeTypes.length; i++) {
                if(Object.keys(this.state.edgeTypes[i]) == relationship.toString()) {
                    return true
                }
            }
        }
        return false
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: editEdgeType
    Description: Edits relationship type by calling update, then saves
    the taxonomy.
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    editEdgeType = (color, relationship) => {
        this.updateEdgeType(color, relationship) // Updates the graph
        let newrEdgeTypes = [...this.state.edgeTypes] // Updates the state
        newrEdgeTypes[this.state.row] = {[relationship]: color}
        this.props.saveTaxonomy(this.state.graph, newrEdgeTypes)
        this.setState({edgeTypes: newrEdgeTypes})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: updateEdgeType
    Description: saves the new graph/edges and relationships
    by copying and modifying that new graph then putting that 
    into the state.
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    updateEdgeType = (color, relationship) => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}
        let oldRelationship = Object.keys(this.state.edgeTypes[this.state.row]) // Name of old relationship. Used to index which relationship lines need to be updated.
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
    Function: deleteEdgeType
    Description: 
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    deleteEdgeType = () => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}
        let oldRelationship = Object.keys(this.state.edgeTypes[this.state.row]) // Name of old relationship. Used to index which relationship lines need to be deleted.

        edgesCopy = edgesCopy.filter(a => a.relationship !== oldRelationship.toString())
        newGraph.edges = edgesCopy

        let newrEdgeTypes = [...this.state.edgeTypes]
        newrEdgeTypes.splice(this.state.row, 1)

        this.props.saveTaxonomy(newGraph, newrEdgeTypes)

        this.setState({edgeTypes: newrEdgeTypes,
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

        for(let i = 0; i < this.state.edges.length; i++) {
            for(let g = 0; g < this.state.graph.edges.length; g++) {
                if(this.state.edges[i] == this.state.graph.edges[g].id) {
                    edgesCopy.splice(g, 1)
                }
            }
        }

        newGraph.edges = edgesCopy
        this.props.saveTaxonomy(newGraph, this.state.edgeTypes)
        this.setState({graph: newGraph,
            nodes: [],
            graphID: this.state.graphID + 1})
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: saveRelationships
    Description: Shows pop up asking if we would like to save.
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    saveRelationships = () => {
        this.isShowPopup(true, "confirm", -1)
    }

     /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: confirmSave
    Description: If so we send relationship data to the flask route.
    Returns: Void
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    confirmSave = () => {
        this.props.saveRelationships(this.state.graph.edges, this.state.graph.nodes, this.state.edgeTypes)
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: getNouns
    Description: Gets terms for the term pop up.
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
                            edgeTypes={this.state.edgeTypes}
                            createEdgeType={this.createEdgeType}
                            createEdge={this.createEdge}
                            editEdgeType={this.editEdgeType}
                            deleteEdgeType={this.deleteEdgeType}
                            row={this.state.row}
                            nouns={this.state.nouns}
                            label={this.state.label}
                        />
                        <h2 className="taxonomy-header">
                            Taxonomy Relationships
                        </h2>
                        <div className="taxonomy-content-box">

                            <div id='graphbox' className="taxonomy-terms-box">
                                <div className="taxonomy-terms-box--left">
                                    <h6 className="taxonomy-sub-header">
                                        Hold ctrl to click on multiple nodes or edges
                                    </h6>
                                    <div className="taxonomy-graph-box">
                                        <Graph 
                                            key={this.state.graphID}
                                            graph={this.state.graph}
                                            options={options}
                                            events={this.state.events}
                                            style={{height: "100%"}}
                                        />
                                        <div className="selected-box">
                                            Currently Selected Edges: &nbsp; 
                                            {this.displaySelectedEdges()}
                                            <br/>
                                            Currently Selected Nodes: &nbsp; 
                                            {this.displaySelectedNodes()}
                                        </div>
                                    </div>
                                </div>

                                <div className="taxonomy-terms-box--center">
                                    <h6 className="taxonomy--center-sub-header centered">
                                        Edit Relationships
                                    </h6> &nbsp; 
                                    <button className="button taxonomy__buttons blue" onClick={() => this.isShowPopup(true, "createNewEdgeType", -1)}>
                                        <FontAwesomeIcon icon={faCirclePlus}/> &nbsp; 
                                        Create New Edge Type
                                    </button>  &nbsp;
                                    {this.state.nodes.length == 2 ?
                                        this.state.edgeTypes.length == 0 ?
                                            <button disabled={true} className="button--disabled taxonomy__buttons" onClick={() => this.isShowPopup(true, "createNewEdge", -1)}>
                                                <FontAwesomeIcon icon={faPlus}/> &nbsp; 
                                                Create New Edge
                                            </button> 
                                            :
                                            <button className="button taxonomy__buttons blue" onClick={() => this.isShowPopup(true, "createNewEdge", -1)}>
                                                <FontAwesomeIcon icon={faPlus}/> &nbsp;
                                                Create New Edge
                                            </button>
                                        : 
                                        <button disabled={true} className="button--disabled taxonomy__buttons" onClick={() => this.isShowPopup(true, "createNewEdge", -1)}>
                                            <FontAwesomeIcon icon={faPlus}/> &nbsp;
                                            Create New Edge
                                        </button>
                                    } &nbsp;
                                    {this.state.nodes.length == 1 ?
                                        <button className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                            <FontAwesomeIcon icon={faFileLines}/> &nbsp;
                                            See Nouns
                                        </button>
                                        : 
                                        <button disabled={true} className="button--disabled taxonomy__buttons" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                            <FontAwesomeIcon icon={faFileLines}/> &nbsp;
                                            See Nouns
                                        </button>
                                    } &nbsp;
                                    {this.state.edges.length == 0 ?
                                        <button disabled={true} className="button--disabled taxonomy__buttons">
                                            <FontAwesomeIcon icon={faTrash}/>
                                            Delete Edge
                                        </button> 
                                        :
                                        <button className="button taxonomy__buttons red" onClick={() => this.deleteEdge()}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                            {this.state.edges.length == 1 ?
                                                "Delete Edge" :
                                                "Delete Edges"
                                            }
                                        </button>
                                    }  &nbsp;
                                <button className="button taxonomy__buttons" onClick={() => this.Screenshot()}>
                                    Take Screenshot
                                </button>  &nbsp;
                                <button className="button taxonomy__buttons" onClick={() => this.saveRelationships()}>
                                    <FontAwesomeIcon icon={faFileArrowDown}/> &nbsp;
                                    Save Relationship
                                </button>  &nbsp;
                                </div>                                
                                 <div className="taxonomy-terms-box--right">
                                    <h6 className="taxonomy-sub-header">
                                        Click to Edit
                                    </h6>
                                    <div className="table-box--taxonomy">
                                        <table className="table table-head">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="table-header">
                                                        Relationship
                                                    </th>
                                                    <th className="table-header">
                                                        Color
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(this.state.edgeTypes).length === 0 ?
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
                            </div>     
                            <div className="page-button-box">
                                <button className="button__small taxonomy__page-buttons" onClick={() => this.props.prevPage()}>
                                    <FontAwesomeIcon icon={faBackward}/> &nbsp; 
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