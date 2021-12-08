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


  /**
   * fetches the parsing data from the json file
   */
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

  /**
   * fetches the weights from the JSON file for the table
   */
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

  /**
   * 
   * @returns table
   */
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

  /**
   * Adds the weights and frequecies to the weight/freq table on the third page
   * @returns table
   */
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

  /**
   * Takes us to the next page of the application
   */
  nextPage = () => {
    if (this.state.mode === 33) {
      this.setState({mode: 66})
    } else if (this.state.mode == 66) {
      this.setState({mode: 99})
    } else if (this.state.mode == 99) {
      this.setState({mode: 100})
    }
  }

  /**
   * Takes us to the previous page of the application
   */
  prevPage = () => {
    if (this.state.mode === 100) {
      this.setState({mode: 99})
    } else if (this.state.mode == 99) {
      this.setState({mode: 66})
    } else if (this.state.mode == 66) {
      this.setState({mode: 33})
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

  /**
   * Interfaces the top navbar to the forward and back buttons
   * @returns navbar
   */
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
                          prevPage={this.prevPage}
                          setOutput={this.setOutput}
                          //getFolder={this.getFolder}
                          /> :

                          this.state.mode === 99 ?
                            <Categories
                              getWeight={this.getWeight}
                              weights={this.state.weights}
                              renderTable={this.renderWeightTable}
                              nextPage={this.nextPage}
                              prevPage={this.prevPage}/> :
                            <Taxonomy prevPage={this.prevPage}/>
        }  
      </>
    )
  }
}
export default App;
