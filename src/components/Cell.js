import React, { Component } from 'react';
import CellVisual from './CellVisual.js';

/*
this.props.value: the true content of this cell. a mine "*", blank "", or a number
this.props.marker: one of '', '?', or 'flag'
this.props.r: the row position of this cell
this.props.c: the column position of this cell
this.props.revealed: whether or not the cell's true contents has been revealed
this.props.losing_cell: boolean. whether this was the cell that the player lost on
this.props.playerLeftClickedCell: callback function
this.props.playerRightClickedCell: callback function
*/
class Cell extends Component {
  // constructor(props)
  // {
  //   super(props);
  // }


  //returns the value that the player should see
  getDisplayedValue()
  {
    if(this.props.revealed)
    {
      return this.props.value;
    }
    else
    {
      return this.props.marker;
    }
  }

  //handles player left clicks and right clicks on the cell
  //note: can only click on a cell if it is not revealed, and does not have a flag/question mark on it
  handleClick(e)
  {
    e.preventDefault(); //so that right clicking doesn't open up a context menu

    if(e.type === 'click') //left click
    {
      //if the cell is already revealed, then left clicking does nothing
      if(!this.props.revealed)
      {
        //if the cell has a flag or ? on it, then left clicking does nothing
        if(this.props.marker === '')
        {
          //need to tell the game that the player clicked the cell, so that the game can 
          //flood-fill if the player clicked on a cell with no adjacent mines, or if the
          //player clicked on a mine, thus ending the game
          this.props.playerLeftClickedCell(this.props.r, this.props.c);
        }
      }
    }
    else if(e.type === 'contextmenu') //right click
    {
      if(!this.props.revealed)
      {
        //then the marker can be cycled. inform the parent component. 
        this.props.playerRightClickedCell(this.props.r, this.props.c);
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
      <div 
        onClick={(e) => {this.handleClick(e)}} 
        onContextMenu={(e) => {this.handleClick(e)}} 
        style={style}
      >
        <CellVisual
          value = {this.getDisplayedValue()}
          revealed = {this.props.revealed}
          losing_cell = {this.props.losing_cell}
          incorrectly_flagged = {this.props.incorrectly_flagged}
        />
      </div>
    );
  }
}

export default Cell;
