const test = require('tape')
const Game = require('./game')
const gameDef = require('./adventure.json')

function setUp() {
  return new Game(gameDef)
}

test('retrieve title from game', (t) => {
    let game = setUp()
    //assert text matches title
    t.equal(game.title, gameDef.title)
    t.end()
})

test('on new game, get first room\'s description', (t) => {
    // start the game
    let game = setUp()
    //assert text matches first room
    t.equal(game.currentRoom.description, "This is the first room")
    t.end()
})

test('get all room exits', (t) => {
    // start the game
    let game = setUp()
    //assert text matches first room
    t.deepEqual(game.currentRoom.exits, [{name: "East", idx: 1}, {name: "West", idx: 2}])
    t.end()
})

test('list out room exit names', (t) => {
    // start the game
    let game = setUp()
    //assert text matches first room
    t.deepEqual(game.currentExits, ["East", "West"])
    t.end()
})

test('can change rooms by following an exit', (t) => {
    // start the game
    let game = setUp()
    game.followExit(0)
    t.deepEqual(game.currentRoom.description, "in the east room")
    t.end()
})

test('can change rooms by setting the currentRoom index', (t) => {
    let game = setUp()
    game.currentRoom = 1
    t.equal(game.currentRoom.description, "in the east room")
    t.end()
})

test('throw error if someone follows an exit that doesn\'t exist', (t) => {
    let game = setUp()
    t.plan(1)
    try {
        game.followExit(12)
    } catch (error) {
        t.equal(error, "Bad exit index")
    }
})

test('throw error if someone goes to a non-numeric exit', (t) => {
    let game = setUp()
    t.plan(1)
    try {
        game.followExit('abc')
    } catch (error) {
        t.equal(error, "Bad exit index")
    }
})

test('throw error if setting currentRoom to a room that does not exist', (t) => {
    let game = setUp()
    t.plan(1)
    try {
        game.currentRoom = 12
    } catch (error) {
        t.equal(error, "Bad room index")
    }
})

test('throw error if setting currentRoom to a non-integer', (t) => {
    let game = setUp()
    t.plan(1)
    try {
        game.currentRoom = 'abc'
    } catch (error) {
        t.equal(error, "Bad room index")
    }
})

