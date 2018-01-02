import React, { Component } from 'react';
import Cell from './components/Cell.js';


//the game is won when all the mines are flagged, and all non-mine cells are revealed/clicked

class App extends Component {
  render() {
    return (
      <Cell
        value = {3}
      />
    );
  }
}

export default App;
