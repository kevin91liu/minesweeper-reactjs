To run, navigate to the project directory, and run `yarn start`. Then go to `localhost:3000` in your browser.

### Notes on differences between my implementation and Windows Minesweeper

1. In Windows's Minesweeper, it seems like your first click will always be on a cell without a mine. In other words, they generate the mine layout after the player makes the first left click. My implementation currently generates the mine layout first, before the player makes the first left click, so it is possible to lose on the first turn. 

