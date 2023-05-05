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

function handleInput(event){
    switch(event.key){
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default:
            setupInput();
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
    cells.forEach(group => {
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
                if(lastValidTile.tile != null){
                    lastValidTile.mergeTile = cell.tile;  //adding the tiles together
                }else{
                    lastValidTile.tile = cell.tile;  //moving the tile to the empty cell
                }
                cell.tile = null;
            }
        }
    })
}