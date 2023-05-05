const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
    #cells; //private variable in javascript
    constructor(gridElement){
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
        });
    }

    get cellsByColumn(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;
            return cellGrid;       // returning the whole grid of cells as column arrays
        }, [])
    }

    get cellsByRow(){
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;       // returning the whole grid of cells as row arrays
        }, [])
    }

    get #emptyCells(){
        return this.#cells.filter(cell => !cell.tile);
    }

    randomEmptyCell(){
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
}

class Cell{
    #cellElement;
    #x;
    #y;
    #tile;
    #mergeTile;

    constructor(cellElement,x, y){
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }
    get tile(){
        return this.#tile;
    }

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }

    get mergeTile(){
        return this.#mergeTile;
    }

    set mergeTile(tile){
        this.#mergeTile = tile;
        if(tile == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }
    set tile(tile){
        this.#tile = tile;
        if(tile == null) return;
        this.#tile.x = this.#x;   //i didnt set the value for x and y here properly i used equality operator instead of assignment operator
        this.#tile.y = this.#y;
    }

    canAccept(tile){
        return (this.tile == null || (this.mergeTile == null && this.tile.value == tile.value))
    }

}



function createCellElements(gridElement){
    const cells = [];
    for(let i = 0; i < GRID_SIZE * GRID_SIZE; i++){
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gridElement.appendChild(cell);
        cells.push(cell);
    }
    return cells;
}