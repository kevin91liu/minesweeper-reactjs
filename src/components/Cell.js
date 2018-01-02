import React, { Component } from 'react';
import CellVisual from './CellVisual.js';

/*
this component contains application logic (aka game logic)

this.props.value: the true content of this cell. a mine "*", blank "", or a number
this.props.revealed: boolean
this.props.gameOver: boolean. if true, prevents clicks from having any effect
this.props.playerLeftClickedCell: callback function
*/
class Cell extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      revealed: false,
      marker: '', //takes on values '', 'flag', or '?'
    }
  }


  //returns the value that the player should see
  getDisplayedValue()
  {
    if(this.state.revealed)
    {
      return this.props.value;
    }
    else
    {
      return this.state.marker;
    }
  }

  //handles player left clicks and right clicks on the cell
  //note: can only click on a cell if it is not revealed, and does not have a flag/question mark on it
  handleClick(e)
  {
    e.preventDefault(); //so that right clicking doesn't open up a context menu

    if(this.props.gameOver) return;

    if(e.type === 'click') //left click
    {
      //if the cell is already revealed, then left clicking does nothing
      if(!this.state.revealed)
      {
        //if the cell has a flag or ? on it, then left clicking does nothing
        if(this.state.marker === '')
        {
          this.setState({revealed: true});
          //need to tell the game that the player clicked the cell, so that the game can 
          //flood-fill if the player clicked on a cell with no adjacent mines, or if the
          //player clicked on a mine, thus ending the game
          this.props.playerLeftClickedCell(this);
        }
      }
    }
    else if(e.type === 'contextmenu') //right click
    {
      if(!this.state.revealed)
      {
        //cycle the marker
      }
    }
    

  }

  getStyle() 
  {
    return {
      height: '20px',
      width: '20px',
    };
  }

  render() {
    let style = this.getStyle();

    return (
      <div onClick={this.handleClick} onContextMenu={this.handleClick} style={style}>
        <CellVisual
          value = {this.getDisplayedValue()}
        />
      </div>
    );
  }
}

export default Cell;
