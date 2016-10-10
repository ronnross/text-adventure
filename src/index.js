const stdin = process.openStdin()
const inquirer = require('inquirer');
const gameDef = require('./adventure.json')
const Game = require('./game')
const quitCmd = 'Quit'

const initialPlayerState = {
  name: undefined,
  hp: 100,
  maxHp: 100
}

function getPlayerStatus(playerState) {
  const hpPerc = playerState.hp / playerState.maxHp

  if (hpPerc > .75) {
    return "you're feeling great"
  } else if (hpPerc > .5) {
    return "you're not feeling the best"
  } else if (hpPerc > .25) {
    return "you don't feel at all well"
  } else if (hpPerc > 0) {
    return "you had better sit down"
  } else {
    return "are you dead, or is this...Ohio?"
  }
}

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
    const newPlayerState = Object.assign({}, initialPlayerState, {name: response.name})
    console.log(`Welcome, ${response.name}`)
    processCommandStep(newPlayerState)
  })

function getProcessCommandStepRunner(playerState) {
  return function runProcessCommandStep() {
    processCommandStep(playerState)
  }
}

function processCommandStep(playerState) {
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

  console.log(`\n** ${playerState.name}, ${getPlayerStatus(playerState)} **\n`)

  inquirer.prompt([{
    type: 'list',
    name: 'command',
    message: gameState.currentRoom.prompt || 'que?',
    choices: [...choices, new inquirer.Separator(), quitCmd]
  }])
  .then((response) => {
    const command = response.command
    if ((command === quitCmd) || (playerState.hp <= 0)) {
      if (playerState.hp <= 0) {
        console.log('Nope...you are dead!')
      }
      console.log(`Goodbye, ${playerState.name}`)
      process.exit(0)
    }

    const {exitMessage, newPlayerState} = gameState.followExit(command, playerState)

    if (exitMessage) {
      pendingMessages.push(exitMessage)
    }

    setTimeout(getProcessCommandStepRunner(newPlayerState), 0)
  }).catch((error) => {
    console.log('Um, what?!', error)
    setTimeout(getProcessCommandStepRunner(playerState), 0)
  })
}
