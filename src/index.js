const stdin = process.openStdin()
const inquirer = require('inquirer');
const gameDef = require('./adventure.json')
const Game = require('./game')
const quitCmd = 'Quit'

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const gameState = new Game(gameDef)
let exitGame = false;

console.log(gameState.title)

function processCommandStep() {
  console.log('\n\n')
  console.log(gameState.currentRoom.description)
  const choices = gameState.currentExits.map((name, idx) => {
    return {
      name,
      value: idx
    }
  })

  inquirer.prompt([{
    type: "list",
    name: "command",
    message: "Where would you like to go?",
    choices: [...choices, new inquirer.Separator(), quitCmd]
  }])
  .then((response) => {
    const command = response.command
    console.log(command);
    if (command === quitCmd) {
      process.exit(0)
    }

    gameState.followExit(command)

    setTimeout(processCommandStep, 0);
  }).catch((error) => {
    console.log("Um, what?!")
    setTimeout(processCommandStep, 0)
  })
}

processCommandStep();