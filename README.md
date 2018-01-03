To run, navigate to the project directory, and run `yarn start`. Then go to `localhost:3000` in your browser.

### Cheat mode

If you want to cheat, you can open up your browser's console, where I print out the locations of all the mines. This is a vestige from developing/debugging.

### Notes on differences between my implementation and Windows Minesweeper

1. In Windows Minesweeper, it seems like your first click will always be on a cell without a mine. In other words, they generate the mine layout after the player makes the first left click. My implementation currently generates the mine layout first, before the player makes the first left click, so it is possible to lose on the first turn. 

2. In my implementation, the player can only win if they place flags on all the cells with mines, and have no flags on cells without mines. In Windows Minesweeper, the player can win in the following condition: the number of unrevealed cells equals the number of remaining mines, even if the player hasn't placed flags on those cells yet.

3. In Windows Minesweeper, if the player loses, and had incorrectly flagged cells that didn't actually have mines in them, the player will see those cells be revealed with a mine with a red X on top of it, indicating their mistake. In my implementation, I just show a red X. An improvement that I could later do is to have my implementation mirror Windows's. 