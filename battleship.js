
var view = {
    displayMessage: function(msg) {
       var messageArea = document.getElementById("messageArea");
       messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
     displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
           {locations: [0, 0, 0], hits: ["", "", ""]},
           {locations: [0, 0, 0], hits: ["", "", ""]}],
    
    
    fire: function(guess) {
        for (var i = 0; i <this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Tiré !");
                if (this.isSunk(ship)) {
                    view.displayMessage("Tu as detruit mon bateau !");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Desolé, perdu !");
        return false;
    },
     isSunk: function(ship) {
            if (ship.hits[0] === "hit" && ship.hits[1] === "hit" && ship.hits[2] === "hit" ) {
                return true;
            } return false;
            
        
        
    },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
   
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            } 
        } return false;
    } 
};
function init() {
    view.displayMessage("Choisir les coordonées !");
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    
    model.generateShipLocations();
}
function parseGuess(guess) {
        var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
        
        if (guess === null || guess.length !== 2) {
            alert("Oups, ça doit etre un lettre et un chiffre.");
        } else {
            var firstChar = guess.charAt(0);
            var row = alphabet.indexOf(firstChar);
            var column = guess.charAt(1);
            
            if (isNaN(row) || isNaN(column)) {
                alert("Oups, ce sont pas des coordonées.");                
            } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
                alert("Oups, c'est dehors de la planche!");
            } else {
                return row + column;
            }
        } return null;
}
var controller = {
    guesses: 0,
      
     processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && (model.shipsSunk === model.numShips)) {
                /*view.displayMessage("Zatopiłeś wszystkie moje okręty, w " + this.guesses + " próbach.");*/
                var modal = document.getElementById("myModal");
                modal.style.display = "block";
                var span = document.getElementsByClassName("close")[0];
                span.onclick = function() {
                modal.style.display = "none";
                    }
 
               
            }
        }
    }
};

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}



window.onload = init;

/*controller.processGuess("A0");
controller.processGuess("D5");*/