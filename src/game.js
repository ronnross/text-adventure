const Player = require('./player')

module.exports = class Game {
  constructor(gameDef) {
    this._game = gameDef
    this._currentRoom = gameDef.startingRoom
    this._player = new Player()
  }

  get player() {
    return this._player
  }

  get title() {
    return this._game.title
  }

  get currentRoom() {
    return this._game.rooms[this._currentRoom]
  }

  set currentRoom(index) {
    const intIndex = parseInt(index)

    if (intIndex >= 0 && intIndex < this._game.rooms.length) {
      this._currentRoom = intIndex
    } else {
      throw "Bad room index"
    }
  }

  get currentExits() {
    const exitNames = []

    for (var i = 0; i < this.currentRoom.exits.length; i++) {
      exitNames.push(this.currentRoom.exits[i].name)
    }

    return exitNames
  }

  applyPlayerChanges(playerChanges) {
    if (!playerChanges) {
      return
    }

    const attributesToChange = Object.keys(playerChanges);

    for (var i = 0; i < attributesToChange.length; i ++) {
      const attributeToChange = attributesToChange[i]
      this._player[attributeToChange] += playerChanges[attributeToChange]
    }
  }

  followExit(index) {
    try {
      const selectedExit = this.currentRoom.exits[index]

      this.applyPlayerChanges(selectedExit.player)
      this.currentRoom = selectedExit.idx

      return selectedExit.message
    } catch (error) {
      throw "Bad exit index " + error
    }
  }
}
