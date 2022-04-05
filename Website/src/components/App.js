import React from 'react';
import NavBar from './NavBar.js';
import Documents from './Documents.js'
import Terms from './Terms.js'
import Categories from './Categories.js'
import Taxonomy from './Taxonomy.js'
import Load from './Load.js'
//import downloader from '../download.js';

/*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: App
Description: Main webpage, calls back-end functions through routes.
Returns: current page
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
class App extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {termsDictionary: {}, //contains {noun: (context, frequency, weight)}
      mode: 0, //indicates which page to load and how much of the navbar progess bar should be loaded
      categories: {}, //contains {category: {noun}}
      input: "", //input folder location
      output: "", //output folder location
      filesList: {}, //list of files found in input location. {fileName: extension}
      selectedFiles: {}, //files to be parsed. {fileName: extension}
      taxonomy: 'master', //master taxonomy name
      relationships: [], //relationship types between categories. [{name: color}]
      graph: {nodes: [], edges: []}, //relationship graph. {nodes: [{color, id, label}], edges:[{color, id, width, from, to, relationship}]}
      nodeID: 0, // ID for nodes
      load: false //loading from or creating a new taxonomy
    }; 
  }

  /*##################################################################################
                                    Folder/ File Routes
  ###################################################################################*/
  
  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: getFiles
  Description: gets files from input location
  Returns: sets name of files (filesList) in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  getFiles = async() => {
    if (this.state.input === "") { // no input location entered
      console.log("Error: no input location entered")
      return false;
    } else if (this.state.output === "") { // no output location entered
      console.log("Error: no output location entered")
      return false;
    }

    let info = {input: this.state.input}

    await fetch('/getFiles', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(info)})
        .then(res => res.json())
          .then(data => {this.setState({filesList: data})})
  }

  /*######################################################################################################
                                        Parser/ Weight Routes
  ######################################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: getTerms
  Description: runs parser on selected files from input location
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  getTerms = async() => {
    let info = {input: this.state.input, output: this.state.output, files: this.state.selectedFiles}
    
    await fetch('/getTerms', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(info)})
        .then(res => res.json())
          .then(this.getWeights()) //get weights after running parser
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: getWeights
  Description: runs parser on selected files from input location
  Returns: sets termsDictionary in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  getWeights = async() => {
    let info = {output: this.state.output, files: this.state.selectedFiles}

    await fetch('/getWeights', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(info)})
        .then(res => res.json())
          .then(data => {this.setState({termsDictionary: data})})
  }


  /*######################################################################################################
                                           Save/ Load Routes
  ######################################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: saveTaxonomy
  Description: writes taxonomy dictionary to .csv
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveTaxonomy = async() => {
    let input = {output: this.state.output, taxonomy: this.state.taxonomy, termsDictionary: this.state.termsDictionary}

    await fetch('/saveTaxonomy', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(input)})
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: saveCategories
  Description: writes categories to .csv
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveCategories = async(cat) => {
    let inputInfo = {output: this.state.output, taxonomy: this.state.taxonomy, categories: this.state.categories}

    await fetch('/saveCategories', {
      method: "POST",
      headers:{"content_type": "application/json",},
      body: JSON.stringify(inputInfo)})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: saveRelationships
  Description: writes relationships to a .json file
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveRelationships = async() => {
    let inputInfo = {output: this.state.output, taxonomy: this.state.taxonomy, graph: this.state.graph, relationships: this.state.relationships}

    await fetch('/saveRelationships', {
      method: "POST",
      headers:{"content_type": "application/json",},
      body: JSON.stringify(inputInfo)})
  }

  /*''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: loadTaxonomy
  Description: loads taxonomy dictionary, graphs, and categories from given file in output location
  Returns: sets taxonomy dictionary in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  loadTaxonomy = async() => {
    let info = {output: this.state.output, taxonomy: this.state.taxonomy}

    await fetch('loadTaxonomy', {
      method: "POST",
      headers:{"content_type": "application/json",},
      body: JSON.stringify(info)})
        .then(res => res.json())
          .then(data => {
            this.setState({termsDictionary: data['taxonomy'],
              graph: data['graph'],
              relationships: data['relationships'],
              nodeID: this.deriveNodeID(data['graph']) // updates node id for graph
            })})
            .then(() => {this.deriveCategories()}) // Needed to load categories
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: deriveNodeID
  Description: gets the last nodes id from the graph, needed because there might not be any nodes
  Returns: the node id
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deriveNodeID = (data) => {
    if (data.nodes.length !== 0) {
      return data.nodes[data.nodes.length - 1].id
    }
    return 0
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: deriveCategories
  Description: creates a dictionary of categories from termsDictionary
  Returns: sets categories from .csv in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deriveCategories = async() => {
    let cat = {};

    for(let [key, value] of Object.entries(this.state.termsDictionary)){
      if(Object.keys(value).includes('category')){
        let subCategory = cat[value['category']];
        if(subCategory){
          cat[value['category']] = {[key]: value, ...subCategory} // ammend new value

        }
        else {
          cat[value['category']] = {[key]: value}; // create new entry
        }
      }
    }

    this.setState({categories: cat});
  }


  /*##################################################################################
                                    Weight Functions
  ##################################################################################*/

  /*''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: deleteFromCategory
  Description: removes selected terms from a category (and removes associated category from term)
  Returns: sets new category and weight dictionary in state
  ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deleteFromCategory = (termsIndex) => {
    const toMove = []
    const newCat = {...this.state.categories}
    const newWeights = {...this.state.termsDictionary}

    for (let r = 0; r < termsIndex.length; r++) { // for each term to be moved, find category/ term information
      toMove.push([Object.keys(this.state.categories)[termsIndex[r][0]], // category name
        Object.keys(Object.values(this.state.categories)[termsIndex[r][0]])[termsIndex[r][1]], // term name
        Object.values(Object.values(this.state.categories)[termsIndex[r][0]])[termsIndex[r][1]]]) // term information (context, frequency, weight)
    }

    for (let r = 0; r < toMove.length; r++) { // for each term to be moved
      delete toMove[r][2]['category'] // removes category associated with term
      newWeights[toMove[r][1]] = toMove[r][2] // replaces term (without associated category) back into weight dictionary
      delete newCat[toMove[r][0]][toMove[r][1]] // deletes the term out of the category
    }

    this.setState({categories: newCat, 
      termsDictionary: newWeights})
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: deleteTerms
  Description: deletes terms out of the weight dictionary
  Returns: sets new weight dictionary in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deleteTerms = (terms) => {
    const newWeights = {...this.state.termsDictionary}

    for (let r = 0; r < terms.length; r++) { // for each term to be deleted
      delete newWeights[Object.keys(this.state.termsDictionary)[terms[r]]] // delete term out of newWeights
    }

    this.setState({termsDictionary: newWeights})
  }


  /*##################################################################################
                                  File/ Folder Functions
  ##################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: removeFile
  Description: removes file from selected files
  Returns: sets in state the select file list
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  removeFile = (row) => {
    const selectedFiles = {...this.state.selectedFiles}

    delete selectedFiles[Object.keys(this.state.filesList)[row]]
    this.setState({selectedFiles: selectedFiles})
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: addFile
  Description: adds file to the selected file list
  Returns:  sets in state the select file list
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  addFile = (row) => {
    const selectedFiles = {...this.state.selectedFiles}

    selectedFiles[Object.keys(this.state.filesList)[row]] = Object.values(this.state.filesList)[row]
    this.setState({selectedFiles: selectedFiles})
  }


  /*##################################################################################
                                    Category Functions
  ##################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: createCategory
  Description: Creates a new category and adds it to the graph as a node
  Returns: adds new category to category state
  ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  createCategory = (category) => {
    const newCategory = {...this.state.categories} // categories dictionary
    newCategory[category] = {} // new category to add to categories
    const nodes = this.state.graph.nodes // cattegory node to be added to graph
    const newGraph = {...this.state.graph} // graph 
    let nodeID = this.state.nodeID // new graph id (updates graph)

    nodeID = nodeID + 1
    nodes.push({id: nodeID, // creates a new node
      label: category, // node name will be category name
      color: '#e04141'
    })

    newGraph.nodes = nodes

    this.setState({categories: newCategory,
      graph: newGraph,
      nodeID: nodeID
    })
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: addToCategory
  Description: adds terms to a category
  Returns: sets categories in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  addToCategory = (termsIndex, category) => {
    const toAdd = [] // list of terms to add
    const newCategory = {...this.state.categories} // categories
 
    for (let r = 0; r < termsIndex.length; r++) { // for each term get info
      toAdd.push([Object.keys(this.state.categories)[category], // name of category
        Object.keys(this.state.termsDictionary)[termsIndex[r]], // name of term
        Object.values(this.state.termsDictionary)[termsIndex[r]]]) // context of term
    }

    for (let r = 0; r < toAdd.length; r++) { // for each term add to category
      toAdd[r][2]['category'] = toAdd[r][0] // adds category to term (association)
      newCategory[toAdd[r][0]][toAdd[r][1]] = toAdd[r][2] // adds term to category
    }

    this.setState({categories: newCategory})
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: deleteCategory
  Description: deletes a category, removes the category from the terms in the category, and deletes node from graph
  Returns: sets new graph in state, sets new weight dictionary (without associated category in terms), and sets new categories
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deleteCategory = (category) => {
    const newWeights = {...this.state.termsDictionary} // weights dictionary
    const newCategories = {...this.state.categories} // categories
    const toAdd = [] // terms to put back into terms list 
    const newGraph = {...this.state.graph} // graph
    const newNodes = [...this.state.graph.nodes] // nodes

    for (let r = 0; r < Object.keys(Object.values(this.state.categories)[category]).length; r++) { // for each term that was in the category
      toAdd.push([Object.keys(Object.values(this.state.categories)[category])[r], // term name
        Object.values (Object.values(this.state.categories)[category])[r]]) // term context
    }

    for (let r = 0; r < Object.keys(toAdd).length; r++) { // for each term
      delete newWeights[toAdd[r][0]]['category'] // delete that terms associated category
    }

    for (let r = 0; r < this.state.graph.nodes.length; r++) { // for each node in graph
      if (this.state.graph.nodes[r].label === Object.keys(this.state.categories)[category]) { // the node is the same as the category to be deleted
        newNodes.splice(r, 1) // delete that node
      }
    }

    newGraph.nodes = newNodes

    delete newCategories[Object.keys(this.state.categories)[category]] // delete the category from  categories

    this.setState({categories: newCategories,
      termsDictionary: newWeights,
      graph: newGraph})
  }


  /*##################################################################################
                                    Taxonomy Functions
  ##################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: saveGraph
  Description: used to set the graph and relationships in state
  Returns: sets graph and relationships in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveGraph = (graph, relationships) => {
    this.setState({graph: graph,
      relationships: relationships})
  }
  
  /*##################################################################################
                                     Webpage Functions
  ##################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: nextPage
  Description: moves through pipeline in webpage
  Returns: sets in state the next page
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  nextPage = () => {
    if (this.state.mode === 0) { // Load
      this.setState({mode: 33})
    } else if (this.state.mode === 33) { // Document
      this.setState({mode: 66})
    } else if (this.state.mode === 66) { // Terms
      this.setState({mode: 99})
    } else if (this.state.mode === 99) { // Taxonomy
      this.setState({mode: 100})
    }
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: prevPage
  Description: moves backwards through the pipeline
  Returns: sets in state the previous page
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  prevPage = () => {
    if (this.state.mode === 100) { // Taxonomy
      this.setState({mode: 99})
    } else if (this.state.mode === 99) { // Categories
      this.setState({mode: 66})
    } else if (this.state.mode === 66) { // Terms
      this.setState({mode: 33})
    } else if (this.state.mode === 33) { // Document
      this.setState({mode: 0})
    }
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: reset
  Description: resets all the state information whenever the loaded page is viewed
  Returns: resets state information and loads documents page
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  reset = (res) => {
    if (res) {
      this.setState({load: true,
        input: "",
        output: "",
        termsDictionary: {},
        categories: {},
        relationships: [],
        selectedFiles: {},
        filesList: {},
        graph: {nodes: [], edges: []}
      })
    } else {
      this.setState({load: false,
        input: "",
        output: "",
        termsDictionary: {},
        categories: {},
        relationships: [],
        selectedFiles: {},
        filesList: {},
        graph: {nodes: [], edges: []}
      })
    }
    this.nextPage()
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: setInput
  Description: input location folder
  Returns: sets in state input location
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  setInput = (input) => {
    this.setState({input: input})
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: setOutput
  Description: output location folder
  Returns: sets in state output location
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  setOutput = (output) => {
    this.setState({output: output})
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: setTaxonomyName
  Description: master taxonomy name (used to name master .csv)
  Returns: sets in state the taxonomy name
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  setTaxonomyName = (name) => {
    this.setState({taxonomy: name})
  }

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: render
  Description: renders the different pages in pipeline
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/ 
  render() { 
    return ( 
      <div className="body"> 
        <NavBar mode={this.state.mode}/>
        {this.state.mode === 0 ? // Load
          <Load reset={this.reset}/>
          :
          this.state.mode === 33 ? // Document
            <Documents nextPage={this.nextPage}
              prevPage={this.prevPage}
              setInput={this.setInput}
              setOutput={this.setOutput}
              input={this.state.input}
              output={this.state.output}
              getFiles={this.getFiles}
              selectedFiles={this.state.selectedFiles}
              filesList={this.state.filesList}
              removeFile={this.removeFile}
              addFile={this.addFile}
              setTaxonomyName={this.setTaxonomyName}
              load={this.state.load}
              taxonomy={this.state.taxonomy}/> 
              : 
              this.state.mode === 66 ? // Terms
                <Terms getTerms={this.getTerms}
                  loadTaxonomy = {this.loadTaxonomy}
                  output={this.state.output}
                  nextPage={this.nextPage}
                  prevPage={this.prevPage}
                  termsDictionary={this.state.termsDictionary}
                  deleteTerms={this.deleteTerms}
                  saveTaxonomy={this.saveTaxonomy}
                  load={this.state.load}/> 
                  :
                  this.state.mode === 99 ? // Categories
                    <Categories termsDictionary={this.state.termsDictionary}
                      nextPage={this.nextPage}
                      prevPage={this.prevPage}
                      createCategory={this.createCategory}
                      categories={this.state.categories}
                      deleteFromCategory={this.deleteFromCategory}
                      addToCategory={this.addToCategory} 
                      saveCategories={this.saveCategories}
                      deleteCategory={this.deleteCategory}/> 
                      : // Taxonomy
                      <Taxonomy saveRelationships={this.saveRelationships}
                        prevPage={this.prevPage}
                        categories={this.state.categories}
                        saveGraph={this.saveGraph}
                        relationships={this.state.relationships}
                        graph={this.state.graph}/>
        }  
      </div>
    )
  }
}

export default App;