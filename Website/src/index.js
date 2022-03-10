import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './styles/navbar.css';
import './styles/load.css';
import './styles/document.css';
import './styles/table.css';
import './styles/categories.css';
import './styles/taxonomy.css';
import './styles/terms.css';


/*'''''''''''''''''''''''''''''''''''
Function: index.js
Description: Loads react webpage
'''''''''''''''''''''''''''''''''''*/
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);