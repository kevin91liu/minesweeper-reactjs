import React, { Component } from 'react';
import Cell from './components/Cell.js';

const DEFAULT_ROWS = 10;
const DEFAULT_COLUMNS = 10;
const DEFAULT_MINES = 10;

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
      cell_contents: null,
      victory_delta: null,
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
        mine_locations[r][c] = pool.splice(getRandomInt(0, pool.length-1), 1)[0];
      }
    }

    return mine_locations;
  }

  /*
  returns a 2 dimensional array, where each element is an object containing cell info:

  the object looks like this:
  {
    value: one of '', '*', or 1-8
    revealed: boolean
    marker: one of '', '?', or 'flag'
  }
  */
  generateCellContents(mine_locations)
  {
    let cell_contents = new Array(mine_locations.length);
    for(let r = 0; r < cell_contents.length; r++)
    {
      cell_contents[r] = new Array(mine_locations[r].length);

      for(let c = 0; c < cell_contents[r].length; c++)
      {
        cell_contents[r][c] = {
          revealed: false, 
          marker: '',
          value: '',
        };

        if(mine_locations[r][c])
        {
          console.log(`mine_locations[r][c] is ${mine_locations[r][c]}, setting ${r},${c} to *`);
          cell_contents[r][c].value = '*';
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
            cell_contents[r][c].value = adjacent_mines;
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
    console.log('mine_locations ', mine_locations);
    let cell_contents = this.generateCellContents(mine_locations);
    console.log('cell_contents ', cell_contents);

    this.setState({
      game_over: false,
      victory: false,
      // mine_locations: mine_locations,
      cell_contents: cell_contents,
      victory_delta: this.state.mines_input,
    });
  }

  playerLeftClickedCell(r, c)
  {
    if(this.state.game_over) return;

    /*
      small note:
      doing this.state.cell_contents.splice() wouldn't create a deep copy, because 
      this.state.cell_contents is an array of references to arrays. i don't need to
      do deep copying so i'm not going to bother with that. the below approach is sufficient:
      modifying state.cell_contents directly (which is normally verboten) and then doing setState
    */
    let cell_contents = this.state.cell_contents;
    cell_contents[r][c].revealed = true;

    if(cell_contents[r][c].value === '*')
    { //player loses  
      this.revealCellsDefeat(cell_contents, r, c);

      this.setState({
        game_over: true,
        victory: false,
        cell_contents: cell_contents,
      });
    
      //placeholder. will come up with something more elegant later. 
      alert('you lost');
    }
    else
    {
      if(cell_contents[r][c].value === '')
      { //the clicked cell has no adjacent mines, so we need to reveal a region
        //i implement a flood fill algorithm
        this.revealCellsFloodFill(cell_contents, r, c);
      }
      
      this.setState({
        cell_contents: cell_contents,
      });
    }
  }

  //r, c are the coordinates of the cell the player clicked on and lost by
  //cell_contents is a reference, so we modify it by reference in this function
  revealCellsDefeat(cell_contents, r, c)
  {
    cell_contents[r][c].losing_cell = true; //so we know this is the cell that the player lost on

    //need to reveal unfound mines, and incorrectly flagged cells
    for(let i = 0; i < cell_contents.length; i++)
    {
      for(let j = 0; j < cell_contents[i].length; j++)
      {
        if(cell_contents[i][j].value === '*')
        {
          cell_contents[i][j].revealed = true;
        }
        else if(cell_contents[i][j].marker === 'flag')
        { //then the cell does not have a mine, but the player incorrectly flagged it
          cell_contents[i][j].revealed = true;
        }
      }
    }
  }

  //cell_contents is a reference, so we modify it by reference in this function
  revealCellsFloodFill(cell_contents, r, c)
  {
    let stack = [];
    stack.push({r: r, c: c});
    while(stack.length > 0)
    {
      let current = stack.pop();

      let cells_to_be_revealed = [];

      //check cell to the north
      if(current.r-1 >= 0 && !cell_contents[current.r-1][current.c].revealed)
      {
        cells_to_be_revealed.push({r: current.r-1, c: current.c});
      }
      //south
      if(current.r+1 < cell_contents.length && !cell_contents[current.r+1][current.c].revealed)
      {
        cells_to_be_revealed.push({r: current.r+1, c: current.c});
      }
      //east
      if(current.c+1 < cell_contents[current.r].length && !cell_contents[current.r][current.c+1].revealed)
      {
        cells_to_be_revealed.push({r: current.r, c: current.c+1});
      }
      //west
      if(current.c-1 >= 0 && !cell_contents[current.r][current.c-1].revealed)
      {
        cells_to_be_revealed.push({r: current.r, c: current.c-1});
      }

      for(let coordinate of cells_to_be_revealed)
      {
        cell_contents[coordinate.r][coordinate.c].revealed = true;
        if(cell_contents[coordinate.r][coordinate.c].value === '')
        {
          stack.push(coordinate);
        }
      }
    }
  }

  playerRightClickedCell(r, c)
  {
    if(this.state.game_over) return;

    let cell_contents = this.state.cell_contents;

    switch(cell_contents[r][c].marker)
    {
      case '':
        cell_contents[r][c].marker = 'flag';
        break;
      case 'flag':
        cell_contents[r][c].marker = '?';
        break;
      case '?':
        cell_contents[r][c].marker = '';
        break;
      default:
        //this should never be reached. i put in the default just to avoid a warning message.
    }

    /*
    check for victory condition: if all cells with mines are flagged, and all non-mine cells 
    do not have flags, then the player wins.

    to do this, i maintain a "delta" to victory. initially, the delta is the # of mines. 
    -when the player correctly flags a mined cell, the delta decrements by 1. 
    -when the player clears a flag from a mined cell, the delta increments by 1. 
    -when the player flags an unmined cell, the delta increments by 1.
    -when the player unflags an unmined cell, the delta decrements by 1

    by keeping a running counter, every time the player right clicks a cell, i don't have to
    pay an O(RC) running time to iterate over all cells and check for correctness
    */
    let delta = this.state.victory_delta;
    if(cell_contents[r][c].value === '*')
    {
      if(cell_contents[r][c].marker === 'flag')
        delta--;
      else if(cell_contents[r][c].marker === '?') //then the player just cleared a flag off a mined cell
        delta++;
    }
    else
    {
      if(cell_contents[r][c].marker === 'flag')
        delta++;
      else if(cell_contents[r][c].marker === '?') //then the player just cleared a flag off an unmined cell
        delta--;
    }

    console.log(`delta is now ${delta}`);

    this.setState({
      cell_contents: cell_contents,
      victory_delta: delta,
    });

    if(delta === 0)
    {
      this.setState({
        game_over: true,
        victory: true,
      });

      //placeholder. will come up with more elegant way later. currently, this blocks the js thread
      //so the setState re-render doesn't happen until the user clicks ok on the alert
      alert('you won!');
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
                    row.map((cell_content, c_index) => {
                      return (
                        <td key={c_index}>
                          <Cell
                            r = {r_index}
                            c = {c_index}
                            value = {cell_content.value}
                            marker = {cell_content.marker}
                            revealed = {cell_content.revealed}
                            losing_cell = {this.state.game_over && cell_content.losing_cell}
                            incorrectly_flagged = {this.state.game_over && cell_content.marker === 'flag' && cell_content.value !== '*'}
                            playerLeftClickedCell = {(r, c) => {this.playerLeftClickedCell(r, c)}}
                            playerRightClickedCell = {(r, c) => {this.playerRightClickedCell(r, c)}}
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
