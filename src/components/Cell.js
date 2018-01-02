import React, { Component } from 'react';
import CellVisual from './CellVisual.js';

/*
this.props.value: the true content of this cell. a mine "*", blank "", or a number
this.props.r: the row position of this cell
this.props.c: the column position of this cell
this.props.revealed: whether or not the cell's true contents has been revealed
this.props.game_over: boolean. if true, prevents clicks from having any effect
this.props.losing_cell: boolean. whether this was the cell that the player lost on
this.props.playerLeftClickedCell: callback function
*/
class Cell extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      marker: '', //takes on values '', 'flag', or '?'
    }
  }


  //returns the value that the player should see
  getDisplayedValue()
  {
    if(this.props.revealed)
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

    if(this.props.game_over) return;

    if(e.type === 'click') //left click
    {
      //if the cell is already revealed, then left clicking does nothing
      if(!this.props.revealed)
      {
        //if the cell has a flag or ? on it, then left clicking does nothing
        if(this.state.marker === '')
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
        //cycle the marker
        switch(this.state.marker)
        {
          case '':
            this.setState({marker: 'flag'});
            break;
          case 'flag':
            this.setState({marker: '?'});
            break;
          case '?':
            this.setState({marker: ''});
            break;
        }
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
