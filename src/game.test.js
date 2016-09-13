const test = require('tape')
const Game = require('./game')

test('retrieve title from game', (t) => {
    let title = "test title"
    let game = new Game(title)
    //assert text matches title
    t.equal(game.title, title)
    t.end()
})

test('on new game, get first room\'s description', (t) => {
    // start the game
    let game = new Game("test title")
    //assert text matches first room
    t.equal(game.currentRoom.description, "This is the first room")
    t.end()
})

test('get all room exits', (t) => {
    // start the game
    let game = new Game("test title")
    //assert text matches first room
    t.deepEqual(game.currentRoom.exits, [{name: "East", idx: 1}, {name: "West", idx: 2}])
    t.end()
})

test('list out room exit names', (t) => {
    // start the game
    let game = new Game("test title")
    //assert text matches first room
    t.deepEqual(game.currentExits, ["East", "West"])
    t.end()
})

test('can change rooms by following an exit', (t) => {
    // start the game
    let game = new Game("test title")
    game.followExit(0)
    t.deepEqual(game.currentRoom.description, "in the east room")
    t.end()
})

test('can change rooms by setting the currentRoom index', (t) => {
    let game = new Game("test title")
    game.currentRoom = 1
    t.equal(game.currentRoom.description, "in the east room")
    t.end()
})

test('throw error if someone follows an exit that doesn\'t exist', (t) => {
    let game = new Game("test title")
    t.plan(1)
    try {
        game.followExit(12)
    } catch (error) {
        t.equal(error, "Bad room index")
    }
})