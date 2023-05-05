import Grid from './Grid.js';
import Tile from './Tile.js';

const gameBoard = document.getElementById('game-board');

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function setupInput(){
    window.addEventListener('keydown',handleInput, {once: true});
}

async function handleInput(event){
    switch(event.key){
        case 'ArrowUp':
            if(!canMoveUp()){
                setupInput();
                return;
            }
            await moveUp();
            break;
        case 'ArrowDown':
            if(!canMoveDown()){
                setupInput();
                return;
            }
            await moveDown();
            break;
        case 'ArrowLeft':
            if(!canMoveLeft()){
                setupInput();
                return;
            }
            await moveLeft();
            break;
        case 'ArrowRight':
            if(!canMoveRight()){
                setupInput();
                return;
            }
            await moveRight();
            break;
        default:
            setupInput();
            return
    }
    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;

    if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
        //alert('Game Over');
        newTile.waitForTransition(true).then(() => {
            alert('Game Over');
        })
        return 
    }

    setupInput()
}

function moveUp(){
    slideTiles(grid.cellsByColumn);
}

function moveDown(){
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft(){
    return slideTiles(grid.cellsByRow)
}

function moveRight(){
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells){
    return Promise.all(
        cells.flatMap(group => {
            const promises = [];
            for (let i = 1; i < group.length; i++){
                const cell = group[i];
                if(cell.tile == null) continue; //if the cell is empty, skip it (continue to the next cell)
                let lastValidTile;
                for(let j = i - 1; j >= 0; j--){
                    const moveToCell = group[j];
                    if(!moveToCell.canAccept(cell.tile)) break;
                    lastValidTile = moveToCell;   //last cell that can accept the tile
                }
                if(lastValidTile != null){
                    promises.push(cell.tile.waitForTransition()); //waiting for the tile to finish moving (transition)
                    if(lastValidTile.tile != null){
                        lastValidTile.mergeTile = cell.tile;  //adding the tiles together
                    }else{
                        lastValidTile.tile = cell.tile;  //moving the tile to the empty cell
                    }
                    cell.tile = null;
                }
            }
            return promises;
        })
    )   
}

function canMoveUp(){
    return canMove(grid.cellsByColumn);
}

function canMoveDown(){
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}

function canMoveLeft(){
    return canMove(grid.cellsByRow);
}

function canMoveRight(){
    return canMove(grid.cellsByRow.map(row => [...row].reverse()));
}

function canMove(cells){
    return cells.some(group =>{
        return group.some((cell, index) =>{
            if (index == 0)  return  false;
            if (cell.tile == null) return false;
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile);
        })
    })
}