import React from 'react';
import NavBar from './NavBar.js';
import Documents from './Documents.js'
import Terms from './Terms.js'
import Categories from './Categories.js'
import Taxonomy from './Taxonomy.js'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {dict: {},
                  weights: {},
                  mode: 33,
                  // categories: {colors: {"red": {frequency: 1, weight: 1}, "blue": {frequency: 2, weight: 2}},
                  //              shapes: {"square": {frequency: 1, weight: 1}, "circle": {frequency: 2, weight: 2}}}
                  categories: {},
                  input: "",
                  output: ""
                  };
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //                       Route Functions
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // Route to run parser from input location and save to output location
  Parser = async() => {
    let directories = {input: this.state.input,
            output: this.state.output}
    await fetch('/parse', {
      method: "POST",
      headers:{
          "content_type": "application/json",
      },
      body: JSON.stringify(directories)})
        .then(res => res.json())
          .then(data => {this.setState({dict: data})})
  }

  // Route to get weights from parser's output location
  getWeight = async() => {
    let input = {input: this.state.output}

    await fetch('/weights', {
            method: "POST",
            headers:{
                "content_type": "application/json",
            },
            body: JSON.stringify(input)})
                    .then(res => res.json())
                      .then(data => {this.setState({weights: data})})
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

  //TODO!!!: save categories and pass to front end!!!
  sendCategories = async(cat) => {
    let inputInfo = {input: this.state.output, data:this.state.categories}
    await fetch('/saveCategories', {
      method: "POST",
      headers:{
          "content_type": "application/json",
      },
      body: JSON.stringify(inputInfo)})
          .then(res => res.json())

    //const newCat = {...this.state.categories}
    //newCat[Object.keys(res)[0]] = Object.values(res)[0]
    //this.setState({categories: newCat})
  }

  // TODO: Create route to add term to weights and remove from category
  addToWeights = (termsIndex) => {
    const toDelete = []
    const newCat = {...this.state.categories}
    const newWeights = {...this.state.weights}

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
                   weights: newWeights})
  }

  // TODO: Create route to add term to category and remove from weights
  addToCategory = (termsIndex, cat) => {
    const toAdd = []
    const newCat = {...this.state.categories}
    const newWeights = {...this.state.weights}

    for (let r = 0; r < termsIndex.length; r++) {
      toAdd.push([Object.keys(this.state.categories)[cat], 
        Object.keys(this.state.weights)[termsIndex[r]], 
        Object.values(this.state.weights)[termsIndex[r]]])
    }

    for (let r = 0; r < toAdd.length; r++) {
      newCat[toAdd[r][0]][toAdd[r][1]] = toAdd[r][2]
      delete newWeights[toAdd[r][1]]
    }
    this.setState({categories: newCat,
                   weights: newWeights})
  }

  // TODO: Create route to delete terms from parser output before running weights
  deleteTerms = (terms) => {
    const newDict = {...this.state.dict}
    const toDelete = []

    for (let r = 0; r < terms.length; r++) {
      toDelete.push([Object.keys(this.state.dict)[terms[r]]])
    }

    for (let r = 0; r < toDelete.length; r++) {
      delete newDict[toDelete[r]]
    }
    this.setState({dict: newDict})
  }

  // TODO: Create route to delete a category and add its terms back to weight
  deleteCategory = (cat) => {
    const newWeights = {...this.state.weights}
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
                   weights: newWeights})
  }

  saveCategories = (cats) => {
    this.sendCategories(cats)
  }

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //                       Webpage Functions
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // Moves to the next page in program
  nextPage = () => {
    if (this.state.mode === 33) {
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
    }
  }

  // Sets the input location for parser
  setInput = (input) => {
    this.setState({input: input})
  }

  // Sets the output location for parser
  setOutput = (output) => {
    this.setState({output: output})
  }

  render() {
    return (
      <>
        <NavBar mode={this.state.mode}/>
        {this.state.mode === 33 ? 
          <Documents dict={this.state.dict}
                      nextPage={this.nextPage}
                      setInput={this.setInput}
                      oldInput={this.state.input}/> : 
                      
                      this.state.mode === 66 ?
                        <Terms Parser={this.Parser}
                          dict={this.state.dict}
                          nextPage={this.nextPage}
                          prevPage={this.prevPage}
                          setOutput={this.setOutput}
                          deleteTerms={this.deleteTerms}
                          oldOutput={this.state.output}
                          /> :

                          this.state.mode === 99 ?
                            <Categories
                              getWeight={this.getWeight}
                              weights={this.state.weights}
                              nextPage={this.nextPage}
                              prevPage={this.prevPage}
                              createCategory={this.createCategory}
                              categories={this.state.categories}
                              addToWeights={this.addToWeights}
                              addToCategory={this.addToCategory}
                              saveCategories={this.saveCategories}
                              
                              deleteCategory={this.deleteCategory}/> :
                            <Taxonomy prevPage={this.prevPage}/>
        }  
      </>
    )
  }
}

export default App;