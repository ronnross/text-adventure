const stdin = process.openStdin();
const Game = require('./game')

const gameState = new Game("test title")

console.log(gameState.title)
console.log(gameState.currentRoom.description)
console.log(gameState.currentExits)

console.log("Where would you like to go? ")
stdin.addListener("data", function(d) {
    const command = d.toString().trim();
    if (command === "exit") {
        stdin.removeAllListeners('data')
        process.exit(0)
    } else {
        try {
            gameState.followExit(parseInt(command))
        } catch (error) {
            console.log('I did not understand that')
        }
        console.log(gameState.currentRoom.description)
        console.log(gameState.currentExits)
    }
});