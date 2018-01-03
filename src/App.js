import React, { Component } from 'react';
import Cell from './components/Cell.js';
import Dashboard from './components/Dashboard.js';


class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      game_over: false,
      victory: false,
      cell_contents: null,
      victory_delta: null,
    }
  }

  /*
  returns a 2-dimensional array of booleans. trues represent where there are mines. 
  */
  generateMineLocations(rows, columns, mines)
  {
    let trues = Array(mines).fill(true);
    let falses = Array(rows * columns - mines).fill(false);
    let pool = trues.concat(falses);

    let getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let mine_locations = new Array(rows);
    for(let r = 0; r < rows; r++) {
      mine_locations[r] = new Array(columns);

      for(let c = 0; c < columns; c++)
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
          console.log(`placing a mine in coordinate ${r},${c}`);
          cell_contents[r][c].value = '*';
        }
        else //figure out the # of adjacent mines to this cell.
        { 
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

  resetGame(rows, columns, mines)
  {
    console.log('resetting game');
    let mine_locations = this.generateMineLocations(rows, columns, mines);
    let cell_contents = this.generateCellContents(mine_locations);

    this.setState({
      game_over: false,
      victory: false,
      cell_contents: cell_contents,
      victory_delta: mines,
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
      modifying this.state.cell_contents directly (which is normally verboten) via a reference 
      and then doing setState
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
    }
    else
    {
      if(cell_contents[r][c].value === '')
      { //then the clicked cell has no adjacent mines, so we need to reveal a region
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

  /*
  i took the stack approach, rather than the recursive approach, arbitrarily.

  cell_contents is a reference, so we modify it by reference in this function
  */
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

    this.setState({
      cell_contents: cell_contents,
      victory_delta: delta,
    });

    if(delta === 0)
    {
      this.setState({
        game_over: true,
        victory: true,
      }, () => {
        /*
        unfortunately, alert is thread-blocking, so it blocks the react re-render. so, when the user
        wins by placing a flag on the last mine, the alert shows up before the flag is visually
        rendered. only after the user clicks ok on the alert does the red flag show up. i tried putting
        the alert in a componentDidUpdate() but that still didn't work. this could be improved. 
        */
        alert('you won!');
      });
    }
  }


  render() {
    return (
      <div>
        <Dashboard
          resetGame = {(rows, columns, mines) => {this.resetGame(rows, columns, mines)}}
        />
        <div>
        {
          this.state.cell_contents != null && 
          ( 
            //something that could be improved: move this into a separate component
            <table style={{borderSpacing: '1px'}}>
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
      </div>
    );
  }
}

export default App;
