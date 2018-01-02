import React, { Component } from 'react';

/*
this component handles only visual (display) code. it does not contain any application logic.
it is a stateless component, and depends only on the props

this.props.value: one of ["", 1-8, "?", "flag", "*"]
this.props.revealed: boolean
this.props.losing_cell: boolean, true if you clicked on a mine in this cell, causing you to lose (TODO: make background color red)
this.props.incorrectly_flagged: boolean. when game over, if you put a flag on this cell but it didn't contain a mine, we want to show a mine with a red X over it
*/
class CellVisual extends Component {
  //1 - blue
  //2 - green
  //3 - red
  //4 - dark purple
  //5 - maroon
  //6 - turquoise
  //7 - black
  //8 - gray

  //a cell can be unrevealed (in which case it could be blank, have a flag, or a question mark)
  //or revealed, in which case it could have a number, be blank, or, in the end game, show a mine.
  //in the end-game, if you clicked on a mine, that cell will have a background color of red

  getStyle()
  {
    let styleDictionary = {
      1: {
        color: '#blue' //#206bbc, a shade of blue
      },
      2: {
        color: 'green'
      },
      3: {
        color: 'red'
      },
      4: {
        color: 'purple'
      },
      5: {
        color: 'maroon'
      },
      6: {
        color: 'turquoise'
      },
      7: {
        color: 'black'
      },
      8: {
        color: 'gray'
      },
      '*': {
        color: 'black'
      },
      '': {
      },
      'flag': {
        color: 'red'
      },
      '?': {
        color: 'black'
      }
    };

    //**TODO: based on this.props.revealed, change the style so you can visually tell

    let style = {
      borderWidth: 1,
      borderColor: 'black',
      backgroundColor: '#e3e5e8',
      borderStyle: 'solid',
      height: '100%',
      width: '100%',
      textAlign: 'center'
    }

    return Object.assign({}, style, styleDictionary[this.props.value]);
  }

  render() {
    let style = this.getStyle();

    return (
      <div style={style}>
        {this.props.value}
      </div>
    );
  }
}

export default CellVisual;
