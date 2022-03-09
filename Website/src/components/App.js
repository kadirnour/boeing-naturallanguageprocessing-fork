import React from 'react';
import NavBar from './NavBar.js';
import Documents from './Documents.js'
import Terms from './Terms.js'
import Categories from './Categories.js'
import Taxonomy from './Taxonomy.js'
import Load from './Load.js'

/*******************************************************************
Function: App
Description: main webpage, calls back-end functions through routes
Returns: current page
********************************************************************/
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
                relationshipTypes: [], //relationship types between categories. [{name: color}]
                graph: {nodes: [], edges: []}, //relationship graph. {nodes: [{color, id, label}], edges:[{color, id, width, from, to, relationship}]}
                load: false}; //loading from or creating a new taxonomy
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //                     Folder/ File Functions
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
  /*******************************************************************
  Function: getFiles
  Description: gets files from input location
  Returns: sets filesList in state
  ********************************************************************/
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

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //                    Parser/ Weight Functions
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  /*******************************************************************
  Function: getTerms
  Description: runs parser on selected files from input location
  ********************************************************************/
  getTerms = async() => {
    let info = {input: this.state.input, output: this.state.output, files: this.state.files}
    
    await fetch('/getTerms', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(info)})
        .then(res => res.json())
          .then(this.getWeights()) //get weights after running parser
  }

  /*******************************************************************
  Function: getWeights
  Description: runs parser on selected files from input location
  Returns: 
  ********************************************************************/
  getWeights = async() => {
    let info = {output: this.state.output, files: this.state.files}

    await fetch('/getWeights', {
      method: "POST",
      headers:{"content_type": "application/json"},
      body: JSON.stringify(info)})
        .then(res => res.json())
          .then(data => {this.setState({weightDictionary: data})})
  }



  // Route to save noun-phrase, context, freq and weight of full corpus
  saveCorpus = async() => {
    let input = {output: this.state.output, 
      files: this.state.files, corpusName: this.state.corpusName} //TODO: pass name of corpus to backend

    
      await fetch('/saveCorpus', {
        method: "POST",
        headers:{
            "content_type": "application/json",
        },
        body: JSON.stringify(input)})
                .then(res => res.json())
                  .then(data => {console.log("SAVE CORPUS COMPLETE")})
  }
  
  loadCorpus = async() => {
    // TODO: pass output location and name of csv then load to apps state.weights obj
    let input = {output: this.state.output, corpusName: this.state.corpusName}

    await fetch('loadCorpus', {
      method: "POST",
      headers:{
          "content_type": "application/json",
      },
    body: JSON.stringify(input)})
            .then(res => res.json())
              .then(data => {this.setState({weightDictionary: data})})
  }

  saveWeight = async() => {
    let inputInfo = {input: this.state.output, corpusName:this.state.corpusName, data:this.state.weightDictionary}
    await fetch('/saveWeight', {
      method: "POST",
      headers:{
          "content_type": "application/json",
      },
      body: JSON.stringify(inputInfo)})
          .then(res => res.json())
  }



  saveTaxonomy = (graph, relationshipTypes) => {
    this.setState({graph: graph,
                  relationshipTypes: relationshipTypes})
  }



  // Route to create a new category
  createCategory = async(name) => {
    const res = await fetch('/category', {
            method: "POST",
            headers:{
                "content_type": "application/json",
            },
            body: JSON.stringify(name)})
                .then(res => res.json())

    const newCat = {...this.state.categories}
    newCat[Object.keys(res)[0]] = Object.values(res)[0]
    this.setState({categories: newCat})
              // .then(res => res.json())
              //     .then(data => {this.setState({categories: data})})
  }

  sendCategories = async(cat) => {
    let inputInfo = {output: this.state.output, corpusName:this.state.corpusName, data:this.state.categories}
    await fetch('/saveCategories', {
      method: "POST",
      headers:{
          "content_type": "application/json",
      },
      body: JSON.stringify(inputInfo)})
          .then(res => res.json())
  }

  //TODO!!!: save categories and pass to front end!!!
  saveRelationships = async(edges, nodes, relationshipTypes) => {
    let inputInfo = {input: this.state.output, corpus:this.state.corpusName, data1:edges, data2:nodes, data3:relationshipTypes}
    await fetch('/saveRelationships', {
      method: "POST",
      headers:{
          "content_type": "application/json",
      },
      body: JSON.stringify(inputInfo)})
          .then(res => res.json())
  }

  // TODO: Create route to add term to weights and remove from category
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
      newWeights[toDelete[r][1]] = toDelete[r][2]
      delete newCat[toDelete[r][0]][toDelete[r][1]]
    }
    this.setState({categories: newCat,
                   weightDictionary: newWeights})
  }

  // TODO: Create route to add term to category and remove from weights
  addToCategory = (termsIndex, cat) => {
    const toAdd = []
    const newCat = {...this.state.categories}
    const newWeights = {...this.state.weightDictionary}

    for (let r = 0; r < termsIndex.length; r++) {
      toAdd.push([Object.keys(this.state.categories)[cat], 
        Object.keys(this.state.weightDictionary)[termsIndex[r]], 
        Object.values(this.state.weightDictionary)[termsIndex[r]]])
    }

    for (let r = 0; r < toAdd.length; r++) {
      newCat[toAdd[r][0]][toAdd[r][1]] = toAdd[r][2]
      delete newWeights[toAdd[r][1]]
    }
    this.setState({categories: newCat,
                   weightDictionary: newWeights})
  }

  // TODO: Create route to delete terms from parser output before running weights
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

  deleteFile = (r) => {
    const newFiles = {...this.state.files}
    delete newFiles[Object.keys(this.state.filesList)[r]]
    this.setState({files: newFiles})
  }

  addFile = (r) => {
    const newFiles = {...this.state.files}
    newFiles[Object.keys(this.state.filesList)[r]] = Object.values(this.state.filesList)[r]
    this.setState({files: newFiles})
  }

  // TODO: Create route to delete a category and add its terms back to weight
  deleteCategory = (cat) => {
    const newWeights = {...this.state.weightDictionary}
    const newCat = {...this.state.categories}
    const toAdd = []

    for (let r = 0; r < Object.keys(Object.values(this.state.categories)[cat]).length; r++) {
      toAdd.push([Object.keys(Object.values(this.state.categories)[cat])[r], 
        Object.values (Object.values (this.state.categories) [cat]) [r]])
    }

    for (let r = 0; r < Object.keys(toAdd).length; r++) {
      newWeights[toAdd[r][0]] = toAdd[r][1]
    }

    delete newCat[Object.keys(this.state.categories)[cat]]

    this.setState({categories: newCat,
                   weightDictionary: newWeights})
  }

  saveCategories = (cats) => {
    this.sendCategories(cats)
  }
  
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //                       Webpage Functions
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // Moves to the next page in program
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

  // Moves back to previous page in program
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

  loaded = (res) => {
    if (res) {
      this.setState({load: true})
    } else {
      this.setState({load: false})
    }
    this.nextPage()
  }

  // Sets the input location for parser
  setInput = (input) => {
    this.setState({input: input})
  }

  // Sets the output location for parser
  setOutput = (output) => {
    this.setState({output: output})
  }

  //Sets the corpus name for csv
  saveCorpusName = (name) => {
    this.setState({corpusName: name})
  }

  render() {
    return (
      <>
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
                    load={this.state.load}/> 
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
                            addToWeights={this.addToWeights}
                            addToCategory={this.addToCategory}
                            saveCategories={this.saveCategories}
                            deleteCategory={this.deleteCategory}/> 
                            :
                            <Taxonomy saveRelationships={this.saveRelationships}
                              prevPage={this.prevPage}
                              categories={this.state.categories}
                              saveTaxonomy={this.saveTaxonomy}
                              relationshipTypes={this.state.relationshipTypes}
                              graph={this.state.graph}/>
          }  
      </>
    )
  }
}

export default App;