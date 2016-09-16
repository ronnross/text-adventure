const stdin = process.openStdin()
const inquirer = require('inquirer');
const gameDef = require('./adventure.json')
const Game = require('./game')
const quitCmd = 'Quit'

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

const gameState = new Game(gameDef)
let exitGame = false
let pendingMessages = []

console.log(gameState.title)

inquirer.prompt([{
  type: 'input',
  name: 'name',
  message: 'What is your name',
}])
  .then((response) => {
    gameState.player.name = response.name
    console.log(`Welcome, ${response.name}`)
    processCommandStep()
  })

function processCommandStep() {
  console.log('\n\n')
  pendingMessages.forEach((msg) => {
    console.log(msg)
  })
  pendingMessages = []
  console.log(gameState.currentRoom.description)
  const choices = gameState.currentExits.map((name, idx) => {
    return {
      name,
      value: idx
    }
  })

  console.log(`\n** ${gameState.player.name}, ${gameState.player.status} **\n`)

  inquirer.prompt([{
    type: 'list',
    name: 'command',
    message: gameState.currentRoom.prompt || 'que?',
    choices: [...choices, new inquirer.Separator(), quitCmd]
  }])
  .then((response) => {
    const command = response.command
    if ((command === quitCmd) || (gameState.player.hp <= 0)) {
      if (gameState.player.hp <= 0) {
        console.log('Nope...you are dead!')
      }
      console.log(`Goodbye, ${gameState.player.name}`)
      process.exit(0)
    }

    const exitMessage = gameState.followExit(command)
    if (exitMessage) {
      pendingMessages.push(exitMessage)
    }

    setTimeout(processCommandStep, 0)
  }).catch((error) => {
    console.log('Um, what?!', error)
    setTimeout(processCommandStep, 0)
  })
}
