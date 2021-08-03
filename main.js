const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const loseSign = "X";
const winSign = "♥";


//Creating class Field
class Field {
  constructor(field) {
    this._field = field;
  }
  
  get field() {
    return this._field;
  }

  print() {
      for(let row of this._field) {
        console.log(row.join("  "))
      }
  }

  playGame() {
    this.print();
    let breakDetected = false;

    while(!breakDetected) {
        let direction = prompt('Select direction: Left(L) | Right(R) | Up(U) | Down(D): ');

        let currentRow = 0;
        let currentColumn = 0; 
    
        let newRow = 0;
        let newColumn = 0; 
    
        //Finding current position and storing in 2 diferent groups. One to by stored in the pathCharacter(newRow) 
        //and another in the fieldCharacter(currentRow). The objective is grab and change the current position to be
        //capable to evaluate the conditions.
        for(let row of this._field) {
            if(row.indexOf(pathCharacter) !== -1) {
                currentRow = this._field.indexOf(row);
                currentColumn = row.indexOf(pathCharacter);
    
                newRow = this._field.indexOf(row);
                newColumn = row.indexOf(pathCharacter);
            }
        }
    
        //Changing the new position depending of the entry value(uppercased)
        //The curent row and column is reserved to be changed for the  fieldCharacter more late
        switch(direction.toUpperCase()) {
            case "R":
                newColumn += 1;
                break;
            case "L":
                newColumn -= 1;
                break;
            case "U":
                newRow -= 1;
                break;
            case "D":
                newRow += 1;
                break;
            default:
                break;
        }

        //Stablishing the breakpoints and conditions. The first one is important because the movement out of the field.
        //That's why is the first and global condition. Then we verify whether the new direction or position is a hole or hat.
        //If none of them is passed then  wejust replace the  current row for tne fieldCharacter and the new row for the pathCharacter and viceversa.
         if(newColumn  >= 0 && newColumn <= this._field[0].length-1 && newRow  >= 0 && newRow <= this._field.length-1) {
            if(this._field[newRow][newColumn] === hole) {
                this._field[currentRow][currentColumn] = fieldCharacter;
                this._field[newRow][newColumn] = loseSign;
                this.print();
                console.log("Sorry mate, you were spaghettified for the black hole, try next time... ヽ(ヅ)ノ");
                breakDetected = true;
            }  else if(this._field[newRow][newColumn] === hat) {
                this._field[currentRow][currentColumn] = fieldCharacter;
                this._field[newRow][newColumn] = winSign;
                this.print();
                console.log("You already find your hat. Nice job boy... (๑‵●‿●‵๑)");
                breakDetected = true;
            } else {
                this._field[currentRow][currentColumn] = fieldCharacter;
                this._field[newRow][newColumn] = pathCharacter;
                this.print();
            }
        } else {
            console.log("Sorry mate you can't leave the field, you know ....ヽ(ヅ)ノ")
            breakDetected = true;
        }
        
      }
    
  }

  static generateField(height, width, percentage) {
      //Creating a new parent empty array
    let newField = [];
    let totalHoles = Math.floor((height * width) * percentage);
    let breakDetected = false;

    while(!breakDetected) {
        //Push new empty arrays based in the height. This will represent the rows.
    for(let i = 0; i < height; i++) {
        newField.push([]);
    }

    //Push new fieldCharacters base in the width. This will represent the columns. The pathCharacter wull be positioned in the top left corner as default.
    for(let row of newField) {
        for(let j = 0; j < width; j++) {
            if(newField.indexOf(row) === 0 && j === 0) {
                row.push(pathCharacter)
            } else if(newField.indexOf(row) === height - 1 && j === width - 1) {
                row.push(hat);
            } else {
                let random = Math.floor(Math.random() * 2);
                switch (random) {
                    case 0:
                        row.push(fieldCharacter);
                        break;
                    case 1:
                        if(totalHoles !== 0) {
                            row.push(hole);
                            totalHoles --;
                        } else {
                            row.push(fieldCharacter);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    //Printing with join every array to be more understandable to the user.
    for(let row of newField) {
        console.log(row.join("  "))
      }

      //Asking if the user accepts the level. Just when the user press "Y" then we generate a new instance of Field and we start the game.
      //If the user press "N" or another thing literally then we break the loop.
      let condition = prompt('Do you want to keep this field and challenge yourself?: Yes(Y) | No(N): ');

      if(condition.toUpperCase() === "Y") {
          const anotherField = new Field(newField);
          anotherField.playGame();
          breakDetected = true;
      } else {
          breakDetected = true;
          console.log("Anyway....")
      } 

    }
  }
}

/* First challenge with a default field
const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

myField.playGame()
*/

//Second challenge with a random field 
Field.generateField(5, 5, 0.3) ;
