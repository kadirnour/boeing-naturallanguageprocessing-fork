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
                  // folder: {},
                  weights: {},
                  mode: 33
                  };
  }


  Parser = async() => {
    let directories = {input: this.state.input,
            output: this.state.output}
    // fetch('/parse').then(res => res.json())
    //                       .then(data => {
    //                         console.log(data)
    // })
    //console.log(this.state.folder)
    //console.log(`/parse/${folder}`)
    await fetch('/parse', {
      method: "POST",
      headers:{
          "content_type": "application/json",
      },
      body: JSON.stringify(directories)})
    .then(res => res.json())
      .then(data => {this.setState({dict: data})})
  }

  getWeight = async() => {
    let input = {input: this.state.output}

    await fetch('/weights', {
            method: "POST",
            headers:{
                "content_type": "application/json",
            },
            body: JSON.stringify(input)})
                        .then(res => res.json())
                          // .then(data => {
                          //   console.log(data)
                          .then(data => {this.setState({weights: data})})
  }

  renderTable = () => {
    const table = []
    for (let r = 0; r < Object.keys(this.state.dict).length; r++) {
      table.push(
        <tr key = {r}>
          <td>{Object.keys(this.state.dict)[r]}</td>
          <td>{Object.values(this.state.dict)[r]}</td>
          {/* <td>{Object.values(this.state.dict)[r].frequency}</td>
          <td>{Object.values(this.state.dict)[r].weight}</td> */}
        </tr>
      )
    }
    return table;
  }

  renderWeightTable = () => {
    const table = []
    for (let r = 0; r < Object.keys(this.state.weights).length; r++) {
      table.push(
        <tr key = {r}>
          <td>{Object.keys(this.state.weights)[r]}</td>
          <td>{Object.values(this.state.weights)[r].frequency}</td>
          <td>{Object.values(this.state.weights)[r].weight}</td>
        </tr>
      )
    }
    return table;
  }

  nextPage = () => {
    if (this.state.mode === 33) {
      this.setState({mode: 66})
    } else if (this.state.mode == 66) {
      this.setState({mode: 99})
    } else if (this.state.mode == 99) {
      this.setState({mode: 100})
    }
  }

  setInput = (input) => {
    this.setState({input: input})
  }

  setOutput = (output) => {
    this.setState({output: output})
  }

  // files = (file) => {
  //   //path = path.substring(0,path.lastIndexOf("\\")+1)
  //   console.log(file)
  // }

  // getFolder = async() => {
  //   await fetch('/folder').then(res => res.json())
  //                   .then(data => {this.setState({folder: data})})
  // }

  render() {
    return (
      <>
        <NavBar mode={this.state.mode}/>
        {this.state.mode === 33 ? 
          <Documents folder={this.state.folder}
                      dict={this.state.dict}
                      // getFolder={this.getFolder}
                      nextPage={this.nextPage}
                      setInput={this.setInput}/> : 
                      
                      this.state.mode === 66 ?
                        <Terms Parser={this.Parser}
                          folder={this.state.folder}
                          dict={this.state.dict}
                          renderTable={this.renderTable}
                          nextPage={this.nextPage}
                          setOutput={this.setOutput}
                          //getFolder={this.getFolder}
                          /> :

                          this.state.mode === 99 ?
                            <Categories
                              getWeight={this.getWeight}
                              weights={this.state.weights}
                              renderTable={this.renderWeightTable}
                              nextPage={this.nextPage}/> :
                            <Taxonomy/>
        }  
      </>
    )
  }
}
export default App;
