import React, { Component } from 'react';

const DEFAULT_ROWS = 10;
const DEFAULT_COLUMNS = 10;
const DEFAULT_MINES = 20;

/*
this component allows the player to specify the game parameters (rows, columns, mines) and reset the game.

this.props.resetGame: callback function
*/
class Dashboard extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      rows_input: DEFAULT_ROWS,
      columns_input: DEFAULT_COLUMNS,
      mines_input: DEFAULT_MINES, 
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount()
  {
    this.resetGame();
  }

  resetGame()
  {
    if(this.state.mines_input > this.state.rows_input * this.state.columns_input)
    { //invalid # of mines
      alert('invalid # of mines');
      return;
    }

    /*
    if the user has 0 or empty string for any of the 3 numeric inputs (rows, columns, mines),
    then i reset the value back to the default and then proceed. 
    */
    this.setState({
      rows_input: this.state.rows_input > 0 ? this.state.rows_input : DEFAULT_ROWS,
      columns_input: this.state.columns_input > 0 ? this.state.columns_input : DEFAULT_COLUMNS,
      mines_input: this.state.mines_input > 0 ? this.state.mines_input : DEFAULT_MINES,
    }, () => {
      this.props.resetGame(this.state.rows_input, this.state.columns_input, this.state.mines_input);
    });
    
  }

  handleSubmit(e)
  {
    e.preventDefault();

    this.resetGame();    
  }

  handleChange(e)
  {
    if(e.target.validity.valid) //ensure the input contains only integers
    {
      this.setState({
        [e.target.name]: parseInt(e.target.value, 10)
      });
    }
  }

  render()
  {
    return (
      <form onSubmit={(e) => {this.handleSubmit(e)}}>
        <label>
          Rows:
          <input 
            type='text'
            pattern='[0-9]*' 
            value={this.state.rows_input} 
            onChange={this.handleChange} 
            name='rows_input'
          />
        </label>

        <label>
          Columns:
          <input 
            type='text' 
            pattern='[0-9]*'
            value={this.state.columns_input} 
            onChange={this.handleChange} 
            name='columns_input'
          />
        </label>

        <label>
          Mines:
          <input 
            type='text' 
            pattern='[0-9]*'
            value={this.state.mines_input} 
            onChange={this.handleChange}
            name='mines_input'
            />
        </label>
        
        <input type="submit" value="Reset"/>
      </form>
    );
  }
}

export default Dashboard;