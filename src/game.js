
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
        this._currentRoom = index
    }

    get currentExits() {
        const exitNames = []

        for (var i = 0; i < this.currentRoom.exits.length; i ++) {
            exitNames.push(this.currentRoom.exits[i].name)
        }

        return exitNames
    }

    followExit(index) {
        try {
            this.currentRoom = this.currentRoom.exits[index].idx
        } catch (error) {
            throw "Bad room index"
        }
    }
}
