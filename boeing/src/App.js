import logo from './logo.svg';
// import axios from 'axios';
import './App.css';
import React from 'react';
import ReactDOM from 'react';

function App() {

  const selectFolder = () => {
    fetch('/path2').then(res => res.json())
                          .then(data => {
                            console.log(data)
    })
  }


  return (
    <button onClick={() => selectFolder()}> Select Folder To Run Parser On: </button>
  )




  // const testURL = () => {
  //   // axios.post("localhost:5000/parser").then(res => console.log(res))
  //   fetch('/parser').then(res =>
  //     console.log(res))
  // }

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //       <button onClick={() => testURL()}> TEST </button>
  //     </header>
  //   </div>
  // );
}

export default App;
