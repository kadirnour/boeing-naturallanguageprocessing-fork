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
    this.state = {weightDictionary: {}, //contains {noun: (context, frequency, weight)}
      mode: 0, //indicates which page to load and how much of the navbar progess bar should be loaded
      categories: {}, //contains {category: {noun}}
      input: "", //input folder location
      output: "", //output folder location
      filesList: {}, //list of files found in input location. {fileName: extension}
      files: {}, //files to be parsed. {fileName: extension}
      corpusName: 'corpus', //master corpus name for this taxonomy
      edgeTypes: [], //relationship types between categories. [{name: color}]
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
  Returns: sets filesList in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  getFiles = async() => {
    if (this.state.input == "") {
      console.log("Error: no input location entered")
      return false;
    } else if (this.state.output == "") {
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
    let info = {input: this.state.input, output: this.state.output, files: this.state.files}
    
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
  Returns: sets weightDictionary in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  getWeights = async() => {
    let info = {output: this.state.output, files: this.state.files}

    await fetch('/getWeights', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(info)})
        .then(res => res.json())
          .then(data => {this.setState({weightDictionary: data})})
  }


  /*######################################################################################################
                                           Save/ Load Routes
  ######################################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: saveWeight
  Description: writes weight dictionary to master corpus .csv
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveWeight = async() => {
    let input = {output: this.state.output, corpus: this.state.corpusName, weightDictionary: this.state.weightDictionary}

    await fetch('/saveWeight', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(input)})
  }

    /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: deriveCategories
  Description: creates a dictionary of categories from weightDictionary
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deriveCategories = async() => {
    let cat = {};

    for(let [key, value] of Object.entries(this.state.weightDictionary)){
      if(Object.keys(value).includes('category')){
        let subCategory = cat[value['category']];
        if(subCategory){
          // ammend new value
          cat[value['category']] = {[key]: value, ...subCategory}
          // delete cat[value['category']][key]['category'];
        }
        else{
          // create new entry
          cat[value['category']] = {[key]: value};
          // delete cat[value['category']][key]['category'];
        }
      }
    }
    this.setState({categories: cat});
  }
  

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: loadCorpus
  Description: loads weight dictionary from given file in output location
  Returns: sets weight dictionary in state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  loadCorpus = async() => {
    let input = {output: this.state.output, corpusName: this.state.corpusName}

    await fetch('loadCorpus', {
      method: "POST",
      headers:{"content_type": "application/json",},
    body: JSON.stringify(input)})
      .then(res => res.json())
        .then(data => {this.setState({
          weightDictionary: data['weight'],
          graph: data['graph'],
          relationshipTypes: data['relationshipTypes']
        })
      })
      .then(() => {
        this.deriveCategories()
      })
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: saveCategories
  Description: writes categories to .csv
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveCategories = async(cat) => {
    let inputInfo = {output: this.state.output, corpusName: this.state.corpusName, categories: this.state.categories}
    await fetch('/saveCategories', {
      method: "POST",
      headers:{"content_type": "application/json",},
      body: JSON.stringify(inputInfo)})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: saveRelationships
  Description: writes relationships to a .json file
 '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/

//  saveRelationships = async(graph, relationshipTypes) => {
//   let inputInfo = {input: this.state.output, corpus: this.state.corpusName, graph: graph, relationshipTypes: relationshipTypes}

 saveRelationships = async(edges, nodes, edgeTypes) => {
  let inputInfo = {input: this.state.output, corpus: this.state.corpusName, edges: edges, nodes: nodes, relationshipTypes: edgeTypes}

  await fetch('/saveRelationships', {
    method: "POST",
    headers:{"content_type": "application/json",},
    body: JSON.stringify(inputInfo)})
}


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveTaxonomy = (graph, edgeTypes) => {
    this.setState({graph: graph,
      edgeTypes: edgeTypes})
  }


  /*##################################################################################
                                    Weight Functions
  ##################################################################################*/


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  addToWeights = (termsIndex) => {
    const toDelete = []
    const newCat = {...this.state.categories}
    const newWeights = {...this.state.weightDictionary}

    for (let r = 0; r < termsIndex.length; r++) {
      toDelete.push([Object.keys(this.state.categories)[termsIndex[r][0]], 
        Object.keys(Object.values(this.state.categories)[termsIndex[r][0]])[termsIndex[r][1]], 
        Object.values(Object.values(this.state.categories)[termsIndex[r][0]])[termsIndex[r][1]]])
    }

    for (let r = 0; r < toDelete.length; r++) {

      delete toDelete[r][2]['category']
      newWeights[toDelete[r][1]] = toDelete[r][2]
      delete newCat[toDelete[r][0]][toDelete[r][1]]
    }
    this.setState({categories: newCat, 
    weightDictionary: newWeights})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deleteTerms = (terms) => {
    const newWeights = {...this.state.weightDictionary}
    const toDelete = []

    for (let r = 0; r < terms.length; r++) {
      toDelete.push([Object.keys(this.state.weightDictionary)[terms[r]]])
    }

    for (let r = 0; r < toDelete.length; r++) {
      delete newWeights[toDelete[r]]
    }
    this.setState({weightDictionary: newWeights})
  }


  /*##################################################################################
                                  File/ Folder Functions
  ##################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deleteFile = (r) => {
    const newFiles = {...this.state.files}
    delete newFiles[Object.keys(this.state.filesList)[r]]
    this.setState({files: newFiles})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  addFile = (r) => {
    const newFiles = {...this.state.files}
    newFiles[Object.keys(this.state.filesList)[r]] = Object.values(this.state.filesList)[r]
    this.setState({files: newFiles})
  }


  /*##################################################################################
                                    Category Functions
  ##################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function: createCategory
  Description: Creates a new category and adds it to the graph as a node
  Returns: adds new category to category state
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  createCategory = (category) => {
    const newCat = {...this.state.categories}
    newCat[category] = {}

    let nodes = this.state.graph.nodes
    let newGraph = {...this.state.graph}
    let nodeID = this.state.nodeID

    nodeID = nodeID + 1
    nodes.push({id: nodeID,
      label: category,
      color: '#e04141'
    })

    newGraph.nodes = nodes

    this.setState({categories: newCat,
      graph: newGraph,
      nodeID: nodeID
    })
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  addToCategory = (termsIndex, cat) => {
    const toAdd = []
    const newCat = {...this.state.categories}
    // const newWeights = {...this.state.weightDictionary}

    for (let r = 0; r < termsIndex.length; r++) {
      toAdd.push([Object.keys(this.state.categories)[cat], 
        Object.keys(this.state.weightDictionary)[termsIndex[r]], 
        Object.values(this.state.weightDictionary)[termsIndex[r]]])
    }

    for (let r = 0; r < toAdd.length; r++) {
      toAdd[r][2]['category'] = toAdd[r][0]
      newCat[toAdd[r][0]][toAdd[r][1]] = toAdd[r][2]
      //delete newWeights[toAdd[r][1]]
    }

    this.setState({categories: newCat})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  deleteCategory = (cat) => {
    const newWeights = {...this.state.weightDictionary}
    const newCat = {...this.state.categories}
    const toAdd = []

    for (let r = 0; r < Object.keys(Object.values(this.state.categories)[cat]).length; r++) {
      toAdd.push([Object.keys(Object.values(this.state.categories)[cat])[r], 
        Object.values (Object.values (this.state.categories) [cat]) [r]])
    }

    for (let r = 0; r < Object.keys(toAdd).length; r++) {
      delete newWeights[toAdd[r][0]]['category']
      // newWeights[toAdd[r][0]] = toAdd[r][1]
    }

    delete newCat[Object.keys(this.state.categories)[cat]]

    this.setState({categories: newCat,
      weightDictionary: newWeights})
  }

  
  /*##################################################################################
                                     Webpage Functions
  ##################################################################################*/

  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  nextPage = () => {
    if (this.state.mode === 0) {
      this.setState({mode: 33})
    } else if (this.state.mode === 33) {
      this.setState({mode: 66})
    } else if (this.state.mode == 66) {
      this.setState({mode: 99})
    } else if (this.state.mode == 99) {
      this.setState({mode: 100})
    }
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  prevPage = () => {
    if (this.state.mode === 100) {
      this.setState({mode: 99})
    } else if (this.state.mode == 99) {
      this.setState({mode: 66})
    } else if (this.state.mode == 66) {
      this.setState({mode: 33})
    } else if (this.state.mode == 33) {
      this.setState({mode: 0})
    }
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  loaded = (res) => {
    if (res) {
      this.setState({load: true,
        input: "",
        output: "",
        weightDictionary: {},
        categories: {},
        edgeTypes: [],
        files: {},
        filesList: {},
        graph: {nodes: [], edges: []}
      })
    } else {
      this.setState({load: false,
        input: "",
        output: "",
        weightDictionary: {},
        categories: {},
        edgeTypes: [],
        files: {},
        filesList: {},
        graph: {nodes: [], edges: []}
      })
    }
    this.nextPage()
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  setInput = (input) => {
    this.setState({input: input})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  setOutput = (output) => {
    this.setState({output: output})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  saveCorpusName = (name) => {
    this.setState({corpusName: name})
  }


  /*'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
  Function:
  Description: 
  Returns: 
  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''*/
  render() {
    return (
      <div className="body">
        <NavBar mode={this.state.mode}/>

        {this.state.mode == 0 ?
          <Load loaded={this.loaded}/>

          :
          this.state.mode === 33 ? 
            <Documents nextPage={this.nextPage}
              prevPage={this.prevPage}
              setInput={this.setInput}
              setOutput={this.setOutput}
              oldInput={this.state.input}
              oldOutput={this.state.output}
              Files={this.getFiles}
              files={this.state.files}
              filesList={this.state.filesList}
              deleteFile={this.deleteFile}
              addFile={this.addFile}
              saveCorpusName={this.saveCorpusName}
              load={this.state.load}
              corpusName={this.state.corpusName}/> 
              : 
              this.state.mode === 66 ?
                <Terms getTerms={this.getTerms}
                  loadCorpus = {this.loadCorpus}
                  nextPage={this.nextPage}
                  prevPage={this.prevPage}
                  saveWeight={this.saveWeight}
                  weightDictionary={this.state.weightDictionary}
                  deleteTerms={this.deleteTerms}
                  save={this.saveCorpus}
                  load={this.state.load}/> 
                  :
                  this.state.mode === 99 ?
                    <Categories weightDictionary={this.state.weightDictionary}
                      nextPage={this.nextPage}
                      prevPage={this.prevPage}
                      createCategory={this.createCategory}
                      categories={this.state.categories}
                      addToWeights={this.addToWeights} // delete from cat
                      addToCategory={this.addToCategory} 
                      saveCategories={this.saveCategories}
                      deleteCategory={this.deleteCategory}/> 
                      :
                      <Taxonomy saveRelationships={this.saveRelationships}
                        prevPage={this.prevPage}
                        categories={this.state.categories}
                        saveTaxonomy={this.saveTaxonomy}
                        edgeTypes={this.state.edgeTypes}
                        graph={this.state.graph}/>
          }  
      </div>
    )
  }
}

export default App;