import React, { Component } from 'react';
import mine_icon from '../assets/mine_icon.png';
import flag_icon from '../assets/flag_icon.svg';

/*
this component handles only visual (display) code. it does not contain any application logic.
it is a stateless component, and depends only on the props

this.props.value: one of ["", 1-8, "?", "flag", "*", "X"]
this.props.revealed: boolean
this.props.losing_cell: boolean, true if you clicked on a mine in this cell, causing you to lose
this.props.incorrectly_flagged: boolean. when game over, if you put a flag on this cell but it didn't contain a mine, we want to show a mine with a red X over it
*/
class CellVisual extends Component {
  //a cell can be unrevealed (in which case it could be blank, have a flag, or a question mark)
  //or revealed, in which case it could have a number, be blank, or, in the end game, show a mine
  //or an X if the player incorrectly flagged the cell as having a mine.
  //in the end-game, if you clicked on a mine, that cell will have a background color of red
  getStyle()
  {
    let style = {
      borderWidth: 1,
      borderStyle: 'solid',
      height: '100%',
      width: '100%',
      textAlign: 'center'
    }

    let styleDictionary = {
      1: {
        color: '#blue'
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
      '?': {
        color: 'black'
      },
      'X': {
        color: 'red'
      }
    };
    //assign font color based on the value
    Object.assign(style, styleDictionary[this.props.value]);

    //visually differentiate revealed cells
    if(this.props.revealed)
    {
      Object.assign(style, {
        backgroundColor: '#b7babf', //a darker shade of gray
        borderColor: 'black',
      });
    }
    else
    {
      Object.assign(style, {
        backgroundColor: '#e3e5e8', //a light shade of gray
        borderTopColor: '#edeff2', //lighter than the above backgroundColor
        borderLeftColor: '#edeff2',
        borderBottomColor: '#cdd1d6', //darker than the above backgroundColor
        borderRightColor: '#cdd1d6',
      });
    }

    if(this.props.losing_cell)
    {
      Object.assign(style, {
        backgroundColor: 'red',
      });
    }

    return style;
  }

  useImage()
  {
    return ['flag', '*'].includes(this.props.value);
  }

  getImage()
  {
    if(this.props.value === 'flag') return flag_icon;
    if(this.props.value === '*') return mine_icon;
  }

  render() {
    let style = this.getStyle();

    return (
      <div style={style}>
      {
        this.useImage() ? (<img src={this.getImage()} style={{height: '20px', width: '20px'}} alt="error"/>) : this.props.value
      }
      </div>
    );
  }
}

export default CellVisual;
