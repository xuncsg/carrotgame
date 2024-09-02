const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constant
const WIN = "Fuiyoh!! You have found the CARROT! Congratulations!";
const LOST = "Haiya!! You have fallen into a HOLE! Try again?";
const OUT = "Haiya!! You have went out of the map! Try again?";
const QUIT = "Alamak!. You quit the game";

// MAP ROWS, COLUMNS, AND PERCENTAGE
const ROWS = 8; // the game map will have 8 rows
const COLS = 5; // the game map will have 5 cols
const PERCENT = 0.2; // % of holes for the map will be 80:20

class Field {


  // create the constructor (FIELD)    
    constructor(field = [[]]) {
        this.field = field; // this.field is a property of the class Field
        this.gamePlay = false; // when the game is instantiated, the gamePlay is false
        this.playerPosition = { HORI: 0, VERT: 0 }; // Initialize player position at the top left corner
    }

    // Static Welcome message after initiation
    static welcomeMsg(msg) {
        console.log(msg);
    }

    // FIELD is RANDOMLY generated using FOR LOOP, where MATH.RANDOM determines GRASS:HOLE
    static generateField(rows, cols, percentage) {
        const map = []; // Corrected the initialization of the map

        for (let i = 0; i < rows; i++) { // create the map with 8 rows
            map[i] = []; // each row will have 5 cols
            for (let j = 0; j < cols; j++) {
                map[i][j] = Math.random() > percentage ? GRASS : HOLE; // generate grass(80%)/hole(20%)
            }
        }

        return map;
    }

    // RANDOMLY generated FIELD is printed (console.log)
    // print the game field (used to update during gameplay) 
    printField() {                                        
        this.field.forEach(element => {
            console.log(element.join("  "));
        });
    }

    // const for CARROT is RANDOMLY planted in FIELD 
    //plantCarrot function
    plantCarrot() {
        let HORI, VERT;
        do {
            HORI = Math.floor(Math.random() * 8); // Generates a random integer between 0 and 7
            VERT = Math.floor(Math.random() * 5); // Generates a random integer between 0 and 4
        } while (this.field[HORI][VERT] === PLAYER); // Ensure carrot is not placed on the player

        this.field[HORI][VERT] = CARROT; // Place the carrot
    }

    // When game is STARTED, the following objects below:

    startGame() {
        this.gamePlay = true; // set this.gamePlay = true to keep the game running

        // PLAYER is inserted at [0][0]
        this.field[0][0] = PLAYER; 

        // CARROT function is planted via method (Refer to code above)
        this.plantCarrot();

        //FIELD is generated (Per above)


         //DO WHILE LOOP is in play (gameplay happening)
         
        while (this.gamePlay) {
            this.printField(); // show the map each time a move is requested

            let flagInvalid = false; // flag to check if any invalid input is entered
            console.log("(u)p, (d)own, (l)eft, (r)ight, (q)uit"); // provide instruction for player to move
            const input = prompt("Which way: "); // obtain the user's direction (up, down, left right, quit)

            switch (input.toLowerCase()) { // acknowledging the user's input
                case "u":
                    this.playerPosition.HORI -= 1; // Move up
                    break;
                case "d":
                    this.playerPosition.HORI += 1; // Move down
                    break;
                case "l":
                    this.playerPosition.VERT -= 1; // Move left
                    break;
                case "r":
                    this.playerPosition.VERT += 1; // Move right
                    break;
                case "q":
                    this.quitGame();
                    return;
                default:
                    console.log("Invalid input");
                    flagInvalid = true;
                    break;
            }

            if (!flagInvalid) {
                this.updateGame();
            }
        }
    }

    // Updates the game after WHILE LOOP is executed (WHILE IN PLAY)

    //ASSIGNMENT
    updateGame() {
        let { HORI, VERT } = this.playerPosition;

        // Check boundaries to make sure the new position is within the field
        if (HORI < 0 || HORI >= ROWS || VERT < 0 || VERT >= COLS) {
            console.log(OUT);
            this.gamePlay = false;
            return;
        }

        // Check for carrot
        if (this.field[HORI][VERT] === CARROT) {
            this.gamePlay = false;
            console.log(WIN);
            return;
        }

        // Check for hole
        if (this.field[HORI][VERT] === HOLE) {
            this.gamePlay = false;
            console.log(LOST);
            return;
        }

        // Clear previous position and update the new position with player symbol
        this.field.forEach(row => row.fill(GRASS, row.indexOf(PLAYER), row.indexOf(PLAYER) + 1)); // Clear old position
        this.field[HORI][VERT] = PLAYER;

        console.log('Continue playing...');
    }

    // Ending the game
    endGame() {
        this.gamePlay = false; // set property gamePlay to false
        process.exit(); // end the Node app
    }

    quitGame() {
        console.log(QUIT);
        this.endGame();
    }
}

// Instantiate a new instance of Field Class
const createField = Field.generateField(ROWS, COLS, PERCENT);
const gameField = new Field(createField);

Field.welcomeMsg("Welcome to Find Uncle Roger's Carrot Seasoned with MSG!!\n*********************************************\n");
Field.welcomeMsg("Find the seasoned carrot in the field but avoid the holes!");
gameField.startGame();
