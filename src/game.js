
module.exports = class Game {
  constructor(gameDef) {
    this._game = gameDef
    this._currentRoom = gameDef.startingRoom
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

  applyPlayerChanges(playerChanges, playerState) {
    if (!playerChanges) {
      return playerState
    }

    const attributesToChange = Object.keys(playerChanges);

    for (var i = 0; i < attributesToChange.length; i ++) {
      const attributeToChange = attributesToChange[i]
      playerState[attributeToChange] += playerChanges[attributeToChange]
    }

    return playerState
  }

  followExit(index, playerState) {
    try {
      const selectedExit = this.currentRoom.exits[index]

      const newPlayerState = this.applyPlayerChanges(selectedExit.player, playerState)
      this.currentRoom = selectedExit.idx

      return { exitMessage: selectedExit.message, newPlayerState }
    } catch (error) {
      throw "Bad exit index " + error
    }
  }
}
