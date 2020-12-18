const gameBoard = ( () => {

    let board = document.querySelector('.gameBoard'); 
    let moves = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; 

    // Updates the move at the specified position in the array 
    const setMove = (row, col, move) => {
        moves[row][col] = move; 
    }; 

    // Disables all cells to scroll over
    const disableCells = () => {
        allCells = Array.from(board.querySelectorAll('.XOCell')); 
        allCells.forEach( (cell) => {
            cell.classList.remove('enabledCell'); 
        });
    }; 

    // Converts CSS grid position to array coordinate
    const convertToArrayIdx = (gridRowStart, gridColStart) =>{

        let arrayRow = 0
        let arrayCol = 0 
        
        if(gridRowStart == 1){
            arrayRow = 0
        }
        else if(gridRowStart == 3){
            arrayRow = 1
        }
        else if(gridRowStart == 5){
            arrayRow = 2
        }

        if(gridColStart == 1){
            arrayCol = 0
        }
        else if(gridColStart == 3){
            arrayCol = 1
        }
        else if(gridColStart == 5){
            arrayCol = 2
        }

        return [arrayRow, arrayCol]; 
    }; 

    return {

        initBoard: () => {
            // Append empty cells to each square of grid
            // Start off disabled with no text
            for(let row=1; row < 6; row +=2){
                for(let col=1; col < 6; col +=2){

                    // Create new cell on board
                    let newCell = document.createElement('div'); 
                    newCell.classList.add('XOCell'); 
                    newCell.style.cssText = `grid-row: ${row} / ${row+1}; grid-column: ${col} / ${col+1}`; 

                    // Add event listener to cell to respond to click if it is enabled
                    newCell.addEventListener('click', (e) => {

                        let currClasses = Array.from(e.target.classList); 
                        
                        // Return if cell is not enabled
                        if( (currClasses.includes('enabledCell') == false) || currClasses.includes('chosenCell') == true){
                            return; 
                        }

                        // Otherwise, update to current player's move
                        let currPlayer = playGame.getCurrentPlayer(); 
                        
                        let newMoveText = document.createElement('p'); 
                        let newMove = 0; 
                        currPlayer == 1 ? newMove = 'X' : newMove = 'O'; 
                        
                        newMoveText.classList.add(newMove); 
                        newMoveText.textContent = newMove; 
                        e.target.appendChild(newMoveText); 

                        // Update move in array
                        let startRow = e.target.style["grid-row-start"]; 
                        let startCol = e.target.style["grid-column-start"]; 
                        let arrayVals = convertToArrayIdx(startRow, startCol); 
                        let arrayRow = arrayVals[0];
                        let arrayCol = arrayVals[1]; 
        
                        setMove(arrayRow, arrayCol, newMove); 
                        
                        // Indicate that this cell has been chosen
                        e.target.classList.add('chosenCell'); 

                        // Disable all other cells
                        disableCells(); 

                        // Send control to playGame to switch players
                        playGame.switchPlayers(); 
                        
                    }); 

                    board.appendChild(newCell);                     
                }
            }
        },

        renderBoard: () =>{
            // Update state of board depending on current moves array 
            let allCells = Array.from(board.querySelectorAll('.XOCell')); 
            let arrRowCount = 0;
            let arrColCount = 0; 

            allCells.forEach( (cell) => {
                
                let matchingMove = moves[arrRowCount][arrColCount]; 
                
                arrColCount = (arrColCount + 1) % 3; 
                if(arrColCount == 0){
                    arrRowCount = (arrRowCount + 1) % 3;
                }

                if(matchingMove != 0){
                    cell.textContent = matchingMove; 
                    cell.classList.add(matchingMove); 
                }
                else{
                    cell.textContent = ''; 
                }

            }); 
        },

        // Enables all cells to scroll over
        enableCells: () => {
            let allCells = Array.from(board.querySelectorAll('.XOCell')); 
            allCells.forEach( (cell) => {
                cell.classList.add('enabledCell'); 
            });
        },

        setMove: setMove,

        disableCells: disableCells,

        // Returns the player that has won if a win state has been reached
        checkWinState: () => {

            // Horizontal win
            let winState = true; 
            let charToMatch = ''; 

            for(let i=0; i < moves.length; i++){
                winState = true;
                charToMatch = moves[i][0]; 

                if(charToMatch == 0){
                    winState = false; 
                    continue; 
                }

                for(let j=0; j < moves.length; j++){
                    if(moves[i][j] != charToMatch){
                        winState = false; 
                        break;
                    }
                }

                if(winState == true){
                    return charToMatch; 
                }
            }

            // Vertical win
            winState = true; 
            charToMatch = ''; 

            for(let j=0; j < moves.length; j++){
                winState = true; 
                charToMatch = moves[0][j]; 

                if(charToMatch == 0){
                    winState = false;
                    continue; 
                }

                for(let i=0; i < moves.length; i++){
                    if(moves[i][j] != charToMatch){
                        winState = false;
                        break;
                    }
                }

                if(winState == true){
                    return charToMatch; 
                }
            }

            // Right diagonal win
            winState = true; 
            charToMatch = moves[0][0];

            if(charToMatch != 0){
                for(let i=0, j=0; i < moves.length && j < moves.length; i++, j++){
                    if(moves[i][j] != charToMatch){
                        winState = false;
                        break;
                    }
                }

                if(winState == true){
                    return charToMatch; 
                }
            }

            // Left diagonal win
            winState = true; 
            charToMatch = moves[0][2];

            if(charToMatch != 0){
                for(let i=0, j=2; i < moves.length && j < moves.length; i++, j--){
                    if(moves[i][j] != charToMatch){
                        winState = false;
                        break;
                    }
                }

                if(winState == true){
                    return charToMatch; 
                }
            }
            
            return 'noWin'; 
        }
    }
})(); 

const playGame = ( () => {

    let currPlayer = 1; 
    let turnsPlayed = 0; 


    // Initialize game; resets play state, sets up turn labels 
    const initGame = () => {
        // Reset play state
        currPlayer = 1; 
        turnsPlayed = 0; 
        
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                gameBoard.setMove(i, j, 0); 
            }
        }

        // Set up label
        statusBar.removeChild(startGameBtn); 
        let turnLabel = document.createElement('h3'); 
        turnLabel.classList.add('turnLabel'); 
        turnLabel.textContent = `Player ${currPlayer}'s Turn`; 
        statusBar.appendChild(turnLabel); 

        // Initialize game board, enable cells to pick
        gameBoard.initBoard(); 
        gameBoard.enableCells(); 

    };

    // Event listener for play button to initialize game 
    const startGameBtn = document.querySelector('.playBtn');
    const statusBar = document.querySelector('.statusBar');  
    startGameBtn.addEventListener('click', initGame); 

    // Checks for win state, updates UI to match win if conditions met
    const checkWinState = () => {

        // Check win state of board
        let winState = gameBoard.checkWinState(); 

        if(winState == 'noWin'){
            return; 
        }


        let turnLabel = document.querySelector('.turnLabel'); 
        turnLabel.textContent = `Player ${winState == 'X'? 1 : 2} wins!`;

        // Disable cells
        gameBoard.disableCells();
        
    }; 

    return {
        
        // Getter for current player
        getCurrentPlayer: () => {
            return currPlayer; 
        }, 

        // Switches current player and current turn 
        switchPlayers: () => {

            // Increase turn count, switch players
            ++turnsPlayed; 

            if(currPlayer == 1){
                currPlayer = 2; 
            }
            else{
                currPlayer = 1; 
            }

            let turnLabel = document.querySelector('.turnLabel'); 
            turnLabel.textContent = `Player ${currPlayer}'s Turn`
            gameBoard.enableCells(); 

            // Check for win state
            checkWinState(); 

        },


    }

})(); 