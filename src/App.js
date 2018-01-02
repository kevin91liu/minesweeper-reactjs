import React, { Component } from 'react';
import Cell from './components/Cell.js';

const DEFAULT_ROWS = 10;
const DEFAULT_COLUMNS = 10;
const DEFAULT_MINES = 30;

//the game is won when all the mines are flagged, and all non-mine cells are revealed/clicked
class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      game_over: false,
      victory: false,
      rows_input: DEFAULT_ROWS,
      columns_input: DEFAULT_COLUMNS,
      mines_input: DEFAULT_MINES, 
    }
  }

  componentDidMount() 
  {
    this.resetGame();
  }

  /*
  returns a 2-dimensional array of booleans. trues represent where there are mines. 
  */
  generateMineLocations()
  {
    let trues = Array(this.state.mines_input).fill(true);
    let falses = Array(this.state.rows_input * this.state.columns_input - this.state.mines_input).fill(false);
    let pool = trues.concat(falses);

    let getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let mine_locations = new Array(this.state.rows_input);
    for(let r = 0; r < mine_locations.length; r++) {
      mine_locations[r] = new Array(this.state.columns_input);

      for(let c = 0; c < mine_locations[r].length; c++)
      {
        //randomly pick from pool (which is an array of booleans)
        mine_locations[r][c] = pool.splice(getRandomInt(0, pool.length-1), 1);
      }
    }

    return mine_locations;
  }

  /*
  returns a 2 dimensional array, where each element is one of: '', '*', or 1-8
  */
  generateCellContents(mine_locations)
  {
    let cell_contents = new Array(mine_locations.length);
    for(let r = 0; r < cell_contents.length; r++)
    {
      cell_contents[r] = new Array(mine_locations[r].length);

      for(let c = 0; c < cell_contents[r].length; c++)
      {
        if(mine_locations[r][c])
        {
          cell_contents[r][c] = '*';
        }
        else
        { //figure out the # of adjacent mines to this cell.
          let adjacent_mines = 0;

          for(let i = r-1; i <= r+1; i++)
          {
            if(i < 0 || i >= mine_locations.length) //out of bounds
              continue; 

            for(let j = c-1; j <= c+1; j++)
            {
              if(j < 0 || j >= mine_locations[r].length) //out of bounds
                continue; 

              //technically not necessary, since cell (r,c) will not contain a mine anyways
              if(i === r && j === c) 
                continue;

              if(mine_locations[i][j]) 
                adjacent_mines++;
            }
          }

          if(adjacent_mines > 0)
            cell_contents[r][c] = adjacent_mines;
          else
            cell_contents[r][c] = '';
        }
      }
    }
    return cell_contents;
  }

  resetGame()
  {
    if(this.state.mines_input > this.state.columns_input * this.state.rows_input)
    { //invalid # of mines
      return;
    }

    let mine_locations = this.generateMineLocations();
    // console.log('mine_locations ', mine_locations);
    let cell_contents = this.generateCellContents(mine_locations);

    //2-dimensional array of 0's
    let revealed_cells = new Array(mine_locations.length);
    for(let i = 0; i < revealed_cells.length; i++)
    {
      revealed_cells[i] = new Array(mine_locations[i].length).fill(false);
    }

    this.setState({
      game_over: false,
      mine_locations: mine_locations,
      cell_contents: cell_contents,
      revealed_cells: revealed_cells,
    });
  }

  playerLeftClickedCell(r, c)
  {
    if(this.state.mine_locations[r][c])
    { //player loses

      /*
      small note:
      doing this.state.revealed_cells.splice() wouldn't create a deep copy, because 
      this.state.revealed_cells is an array of references to arrays. i don't need to
      do deep copying so i'm not going to bother with that. the below approach is sufficient:
      modifying state.revealed_cells directly (which is normally verboten) and then doing setState
      */
      let revealed_cells = this.state.revealed_cells;
      revealed_cells[r][c] = true;

      //need to reveal unfound mines, and incorrectly flagged cells

      let incorrectly_flagged = new Array(this.state.mine_locations.length);
      for(let i = 0; i < this.state.mine_locations.length; i++)
      {
        incorrectly_flagged[i] = new Array(this.state.mine_locations[i].length).fill(false);
      }

      for(let i = 0; i < this.state.mine_locations.length; i++)
      {
        for(let j = 0; j < this.state.mine_locations[i].length; j++)
        {
          if(this.state.mine_locations[i][j])
          {
            revealed_cells[i][j] = true;
          }
          //**TODO: else if the cell was incorrectly flagged, reveal it, and set incorrectly_flagged
          //**TODO: need to lift up the "marker" variable from the Cell component up to here
          //**TODO: reorganize. instead of having multiple RxC arrays containing 1 piece of info each, have 1 RxC array containing an object holding all the info for that cell

        }
      }

      this.setState({
        game_over: true,
        victory: false,
        losing_coordinates: {r: r, c: c},
        revealed_cells: revealed_cells,
        incorrectly_flagged: incorrectly_flagged,
      });
      
      //placeholder. will come up with something more elegant later. 
      alert('you lost');
    }
    else
    { //reveal the appropriate cells

    }
  }


  render() {
    return (
      <div>
      {
        this.state.cell_contents != null && 
        ( //**TODO: move this into a separate visual component
          <table>
            <tbody>
            {
              this.state.cell_contents.map((row, r_index) => {
                return (
                  <tr key={r_index}>
                  {
                    row.map((cell_value, c_index) => {
                      return (
                        <td key={c_index}>
                          <Cell
                            r = {r_index}
                            c = {c_index}
                            value = {cell_value}
                            revealed = {this.state.revealed_cells[r_index][c_index]}
                            game_over = {this.state.game_over}
                            losing_cell = {this.state.game_over && r_index === this.state.losing_coordinates.r && c_index === this.state.losing_coordinates.c}
                            incorrectly_flagged = {this.state.game_over && this.state.incorrectly_flagged[r_index][c_index]}
                            playerLeftClickedCell = {(r, c) => {this.playerLeftClickedCell(r, c)}}
                          />
                        </td>
                      );
                    })
                  }
                  </tr>
                )
              })
            }
            </tbody>
          </table>
        )
      }
      </div>
    );
  }
}

export default App;
