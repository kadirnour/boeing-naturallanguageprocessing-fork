import React from 'react';
//import example from '../images/taxonomy_example.png';

import Graph from 'vis-react';

var options = {
    layout: {
        hierarchical: true
    },
    edges: {
        color: '#000000'
    },
    interaction: { hoverEdges: true, multiselect: true, hover: true}
};



class Taxonomy extends React.Component {
    constructor() {  
        super();  
        this.state = {  
            newID: 0,
            counter: 5,
            graph: {
              nodes: [
                { id: 1, label: "Node 1", color: "#e04141" },
                { id: 2, label: "Node 2", color: "#e09c41" },
                { id: 3, label: "Node 3", color: "#e0df41" },
                { id: 4, label: "Node 4", color: "#7be041" },
                { id: 5, label: "Node 5", color: "#41e0c9" }
              ],
              edges: [
                { from: 1, to: 2 },
                { from: 1, to: 3 },
                { from: 2, to: 4 },
                { from: 2, to: 5 }
              ]
            },
            events: {
              click: ({ nodes, edges }) => {
                  this.setState({nodes: nodes})
                //this.doSomething2(nodes, edges)
                // console.log("Selected nodes:");
                // console.log(nodes);
                // console.log("Selected edges:");
                // console.log(edges);
                // alert("Selected node: " + nodes);
              }
            }
        }  
    } 

    doSomething = () => {
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

    doSomething2 = () => {
        let newEdges = [...this.state.graph.edges]
        let newGraph = {...this.state.graph}

        newEdges.push({from: this.state.nodes[0], to: this.state.nodes[1]})

        newGraph.edges = newEdges

        this.setState({
            graph: newGraph,
            newID: this.state.newID + 1
        })            
    }


    render() {
        return (
            <div className = "page">
                <button onClick={() => this.doSomething()}>CLICK ME</button>
                <button onClick={() => this.doSomething2()}>CLICK ME 2</button>
                <Graph key={this.state.newID} graph={this.state.graph} options={options} events={this.state.events} style={{ height: "640px" }} />
            </div>
        )
    }

}

export default Taxonomy