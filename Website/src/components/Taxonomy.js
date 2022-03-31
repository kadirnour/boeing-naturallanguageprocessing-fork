import React from 'react';
import ModalPopup from './modal_taxonomy';
import Graph from 'vis-react';
import download from 'downloadjs';
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faFileArrowDown, faFileLines, faTrash, faCirclePlus, faPlus }
    from '@fortawesome/free-solid-svg-icons'

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
        hoverEdges: true 
    }
};
   
class Taxonomy extends React.Component {
    constructor() {  
        super();  
        this.state = {  
            graphID: 0, // ID for graph. Whenever the graph is updated, needs a new graphID to display changes
            edgeTypes: [], // edge types
            showModalPopup: false,
            selectedNodes: [], // List of currently selected nodes
            node1: -1, // First node selected (Needed for relationship line direction)
            node2: -1, // Second node selected (Needed for relationship line direction)
            selectedEdges: [], // List of selected edges
            type: "", // Type of modal to be opened
            graph: { // graph
              nodes: [], // nodes in graph (catgories)
              edges: [] // edges in graph (relationships)
            },
            events: { // Logic for selecting nodes
                click: ({ nodes, edges }) => {
                    this.setState({selectedEdges: edges}) // Adds selected edges to state
                    if(nodes.length === 2) { // Two nodes are selected
                        if(this.state.node1 === -1) { // Deals with bug where user drags a node instead of clicking and node is not added to nodes list
                            this.setState({node1: nodes[0]}) // Sets node1 to the first node in the list as default
                        }
                        let node2 = -1
                        for(let i = 0; i < nodes.length; i++) {  // Deals with bug where user drags a node instead of clicking and node is not added to nodes list
                            if(nodes[i] !== this.state.node1) {
                                node2 = nodes[i] // Sets node2 to the other node in the list as default
                            }
                        }
                        this.setState({selectedNodes: nodes,
                            node2: node2})
                    } else if (nodes.length === 1) { // One node selected
                        this.setState({selectedNodes: nodes,
                            node1: nodes[0]})
                    } else { // No nodes are selected
                        this.setState({selectedNodes: nodes})
                    }
                }
            }
        }  
    } 


    /*##################################################################################
                                        Modal Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: isShowPopup
    Description: opens or closes modal to create modal type
    Returns: sets in state modal status, modal type, and row
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    isShowPopup = (status, type, row) => {  
        if (type === "nouns") { // modal will show nouns found in node (category)
            this.getNouns()
        }

        this.setState({showModalPopup: status,
            type: type, // modal type
            row: row // category row (for nouns)
        });  
    };  

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: componentDidMount
    Description: Pushes nodes, graph and edge types into components
    Returns: sets in state graph, a new graphID, and edge types
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    componentDidMount() {
        this.setState({graph: this.props.graph,
            graphID: this.state.graphID + 1,
            edgeTypes: this.props.edgeTypes
        })
    }


    /*##################################################################################
                                    Graph Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: renderEdgeTypes
    Description: Renders relationship types to the table
    Returns: list of edges
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    renderEdgeTypes = () => {
        const table = []
        for (let r = 0; r < Object.keys(this.state.edgeTypes).length; r++) { // for each edge type in edge types
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
    Description: dispalys in graph currently selected nodes
    Returns: string of currently selected nodes
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    displaySelectedNodes = () => {
        let result = ""
        for(let i = 0; i < this.state.selectedNodes.length; i++) { // for each node in selected nodes
            result += this.state.selectedNodes[i]  + ", "
        }
        return result.slice(0, result.length - 2) // removes extra ,
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: displaySelectedEdges
    Description: displays in graph currently selected edges
    Returns: string of currently selected edges
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    displaySelectedEdges = () => {
        let result = ""
        let from = ""
        let to = ""
        for(let i = 0; i < this.state.selectedEdges.length; i++) { // for each edge in seleceted edges
            for(let g = 0; g < this.state.graph.edges.length; g++) { // for each edge in graph
                if(this.state.selectedEdges[i] === this.state.graph.edges[g].id) { // graph edge and selected edge are the same
                    for(let i = 0; i < this.state.graph.nodes.length; i++) { // each node in graph nodes
                        if(this.state.graph.nodes[i].id === this.state.graph.edges[g].from){ // selected edge from is the same as graph node
                            from = this.state.graph.nodes[i].label
                        }
                        if(this.state.graph.nodes[i].id === this.state.graph.edges[g].to){ // selected edge to is the same as graph node
                            to = this.state.graph.nodes[i].label
                        }
                    }
                    result += from + ">" + to
                }
            }
        }
        return result
    }


    /*##################################################################################
                                    Relationship Functions
    ###################################################################################*/

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: createEdgeType
    Description: if the relations type does not exist, function creates
    the new relationship type and pushes it to edge types
    Returns: sets in state new edge types
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    createEdgeType = (color, relationship) => {
        if(!this.checkEdgeExists(relationship)) {
            let newEdgeTypes = [...this.state.edgeTypes]

            newEdgeTypes.push({[relationship]: color})
            this.props.saveTaxonomy(this.state.graph, newEdgeTypes) // saves graph and edge types to the App.js state

            this.setState({edgeTypes: newEdgeTypes})
        }
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: createEdge
    Description: Draws the relationship from node 1 to node 2 and saves the
    result.
    Returns: sets in state new graph, graphID, and a empty selected nodes list
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    createEdge = (color, relationship) => {
        let newEdges = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}

        for(let i = 0; i < this.state.graph.edges.length; i++) { // Removes edges if nodes already have an edge between them
            if((this.state.graph.edges[i].from === this.state.selectedNodes[0] && this.state.graph.edges[i].to === this.state.selectedNodes[1])
            || (this.state.graph.edges[i].from === this.state.selectedNodes[1] && this.state.graph.edges[i].to === this.state.selectedNodes[0])) {
                newEdges.splice(i, 1)
            }
        }

        newEdges.push({from: this.state.node1, to: this.state.node2, color: color, width: 3, relationship: relationship})
        newGraph.edges = newEdges
        this.props.saveTaxonomy(newGraph, this.state.edgeTypes) // saves graph and edge types to the App.js state

        this.setState({graph: newGraph,
            graphID: this.state.graphID + 1,
            selectedNodes: []
        })            
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: checkEdgeExists
    Description: checks if the edge exists already
    Returns: true if edge exists or if the name is empty
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    checkEdgeExists = (relationship) => {
        if(relationship.toString() === "") { // must name the edge type
            return true
        }
        if(this.state.edgeTypes.length !== 0) { // checks if the edge already exists
            for(let i = 0; i < this.state.edgeTypes.length; i++) {
                if(Object.keys(this.state.edgeTypes[i]) === relationship.toString()) {
                    return true
                }
            }
        }
        return false
    }

    /*''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: editEdgeType
    Description: edits color or relationship name of edge type. updates all exisiting edges.
    Returns: sets new edge types in state
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    editEdgeType = (color, relationship) => {
        this.updateEdgeType(color, relationship) // Updates the graph

        let newrEdgeTypes = [...this.state.edgeTypes] // Updates the state
        newrEdgeTypes[this.state.row] = {[relationship]: color}

        this.props.saveTaxonomy(this.state.graph, newrEdgeTypes) // saves graph and edge types to the App.js state

        this.setState({edgeTypes: newrEdgeTypes})
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: updateEdgeType
    Description: updates existing edge types with new name/ color
    Returns: sets in state new graph
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    updateEdgeType = (color, relationship) => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}
        let oldRelationship = Object.keys(this.state.edgeTypes[this.state.row]) // Name of old relationship. Used to index which relationship lines need to be updated.

        for(let i = 0; i < this.state.graph.edges.length; i++) { // updates all edges that have been updated
            if(this.state.graph.edges[i].relationship === oldRelationship) {
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
    Description: deletes an edge type and removes edges from graph
    Returns: sets in state new edge types and new graph
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    deleteEdgeType = () => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}
        let oldRelationship = Object.keys(this.state.edgeTypes[this.state.row]) // Name of old relationship. Used to index which relationship lines need to be deleted.

        edgesCopy = edgesCopy.filter(a => a.relationship !== oldRelationship.toString()) // removes edges from graph
        newGraph.edges = edgesCopy

        let newEdgeTypes = [...this.state.edgeTypes]
        newEdgeTypes.splice(this.state.row, 1) // removes edge type from edge types list

        this.props.saveTaxonomy(newGraph, newEdgeTypes) // saves graph and edge types to the App.js state

        this.setState({edgeTypes: newEdgeTypes,
            graph: newGraph,
            graphID: this.state.graphID + 1
        })
    }


    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: deleteEdge
    Description: Deletes the edges between two nodes
    Returns: sets in state new graph, and empty selected nodes list
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    deleteEdge = () => {
        let edgesCopy = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}

        for(let i = 0; i < this.state.selectedEdges.length; i++) { // removes edge from graph edges
            for(let g = 0; g < this.state.graph.edges.length; g++) {
                if(this.state.selectedEdges[i] === this.state.graph.edges[g].id) {
                    edgesCopy.splice(g, 1)
                }
            }
        }

        newGraph.edges = edgesCopy
        this.props.saveTaxonomy(newGraph, this.state.edgeTypes) // saves graph and edge types to the App.js state

        this.setState({graph: newGraph,
            selectedNodes: [],
            graphID: this.state.graphID + 1})
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: saveRelationships
    Description: Shows pop up asking if we would like to save to .csv
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    saveRelationships = () => {
        this.isShowPopup(true, "confirm", -1)
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: confirmSave
    Description: saves graph and edge types to .csv
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
    confirmSave = () => {
        this.props.saveRelationships()
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: getNouns
    Description: gets terms from a node (category)
    Returns: sets in state the node label (category) and the nouns in that node
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    getNouns = () => {
        let label = ""

        for(let i = 0; i < this.state.graph.nodes.length; i++) { // gets the label of the node
            if(this.state.graph.nodes[i].id === this.state.selectedNodes[0]){
                label = this.state.graph.nodes[i].label
            }
        }

        this.setState({label: label,
            nouns: this.props.categories[label]
        })
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: Screenshot
    Description: takes a screenshot of the graph and edge types, then saves it to browser as a .png
    Returns: Void 
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/   
    Screenshot = () =>{
        html2canvas(document.getElementById("graphbox"), {})
            .then(function (canvas) {
                let image = canvas.toDataURL("image/png");
                download(image, "relationship.png", "text/png")
            })
            .catch((e) => {
                console.log(e);
            });
    }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Function: render
    Description: renders Taxonomy page from pipeline
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
                                    {this.state.selectedNodes.length === 2 ? // two nodes have been selected
                                        this.state.edgeTypes.length === 0 ? // no edge types are created
                                            <button disabled={true} className="button--disabled taxonomy__buttons" onClick={() => this.isShowPopup(true, "createNewEdge", -1)}>
                                                <FontAwesomeIcon icon={faPlus}/> &nbsp; 
                                                Create New Edge
                                            </button> 
                                            : // there are edge types created
                                            <button className="button taxonomy__buttons blue" onClick={() => this.isShowPopup(true, "createNewEdge", -1)}>
                                                <FontAwesomeIcon icon={faPlus}/> &nbsp;
                                                Create New Edge
                                            </button>
                                        : // not two nodes selected
                                        <button disabled={true} className="button--disabled taxonomy__buttons" onClick={() => this.isShowPopup(true, "createNewEdge", -1)}>
                                            <FontAwesomeIcon icon={faPlus}/> &nbsp;
                                            Create New Edge
                                        </button>
                                    } &nbsp;
                                    {this.state.selectedNodes.length === 1 ? // one node has been selected
                                        <button className="button taxonomy__buttons" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                            <FontAwesomeIcon icon={faFileLines}/> &nbsp;
                                            See Nouns
                                        </button>
                                        : // not one node has been selected
                                        <button disabled={true} className="button--disabled taxonomy__buttons" onClick={() => this.isShowPopup(true, "nouns", -1)}>
                                            <FontAwesomeIcon icon={faFileLines}/> &nbsp;
                                            See Nouns
                                        </button>
                                    } &nbsp;
                                    {this.state.selectedEdges.length === 0 ? // 0 edges have been selected
                                        <button disabled={true} className="button--disabled taxonomy__buttons">
                                            <FontAwesomeIcon icon={faTrash}/>
                                            Delete Edge
                                        </button> 
                                        : // more than 0 edges have been selected
                                        <button className="button taxonomy__buttons red" onClick={() => this.deleteEdge()}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                            {this.state.selectedEdges.length === 1 ? // 1 edge has been selected
                                                "Delete Edge" 
                                                : // multiple edges have been selected
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
                                                {Object.keys(this.state.edgeTypes).length === 0 ? // no edge types have been created
                                                    <tr>
                                                        <td></td>
                                                    </tr>
                                                    : 
                                                    this.renderEdgeTypes()
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