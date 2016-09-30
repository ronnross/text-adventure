const stdin = process.openStdin()
const inquirer = require('inquirer');
const gameDef = require('./adventure.json')

const quitCmd = 'Quit'
const namePrompt = {
  type: 'input',
  name: 'name',
  message: 'What is your name?',
}
const initialGameState = {
  name: undefined,
  hp: 100,
  currentRoom: gameDef.startingRoom,
  shouldQuit: false
}

//generic
const debug = (...args) => console.log('~~~~~~~~~~~~ DEBUG ', ...args)

const inform = (msg) => console.log(msg)

function buildRoomPrompt(gameState) {
  return {
    type: 'list',
    name: 'command',
    message: getCurrentRoom(gameState).prompt || 'que?',
    choices: [...getExitsForPrompt(gameState), new inquirer.Separator(), quitCmd]
  }
}

function objMap(obj, cb) {
  return Object.keys(obj).map((key) => {
    return cb(key, obj[key])
  })
}

//game
function getCurrentRoom(gameState) {
  return gameDef.rooms[gameState.currentRoom]
}

function getExitsForPrompt(gameState) {
  return getCurrentRoom(gameState).exits.map(({name}, idx) => {
    return {name, value: idx}
  })
}

function applyPlayerChanges(gameState, playerChanges) {
  if (!playerChanges) {
    return gameState
  }

  const attributesToChange = Object.keys(playerChanges);

  for (var i = 0; i < attributesToChange.length; i ++) {
    const attributeToChange = attributesToChange[i]
    gameState[attributeToChange] += playerChanges[attributeToChange]
  }

  return gameState
}

//engine
function handleQuit(nothing, gameState) {
  return {
    gameState: Object.assign({}, gameState, {shouldQuit: true}),
    msgs: [`Goodbye, ${gameState.name}.`]
  }
}

function handleNameChange(playerName, gameState) {
  return {
    gameState: Object.assign({}, gameState, {name: playerName}),
    msgs: [`Welcome, ${playerName}!`]
  }
}

function handleRoomExit(index, gameState) {
  try {
    const selectedExit = getCurrentRoom(gameState).exits[index]

    gameState = applyPlayerChanges(gameState, selectedExit.player)
    gameState.currentRoom = selectedExit.idx

    return {
      gameState,
      msgs: [selectedExit.message]
    }
  } catch (error) {
    throw "Bad exit index " + error
  }
}

function getCommandHandler(promptResult) {
  if (promptResult.name) {
    return {
      handler: handleNameChange,
      param: promptResult.name
    }
  } else if (promptResult.command !== undefined) {
    if (promptResult.command === quitCmd) {
      return {
        handler: handleQuit,
        param: ''
      }
    } else {
      return {
        handler: handleRoomExit,
        param: promptResult.command
      }
    }
  }
  return {
    handler: () => {},
    param: 'No clue'
  }
}

function promptUser(prompt, currGameState, ...msgs) {
  msgs.forEach(inform)

  if (currGameState.shouldQuit) {
    process.exit(0)
  }

  inquirer
  .prompt([prompt])
  .then(getCommandHandler)
  .then(({handler, param}) => {
    const {gameState, msgs} = handler(param, currGameState)

    promptUser(buildRoomPrompt(gameState), gameState, ...msgs.filter((msg) => msg !== undefined))
  })
  .catch((error) => {
    promptUser(buildRoomPrompt(gameState), gameState, `Um, somthing bad happened! (${error})`)
  })
}

//setup game
promptUser(namePrompt, initialGameState, `********${gameDef.title}******`)
