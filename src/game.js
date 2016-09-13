module.exports = class Game {
    constructor(title) {
        this._title = title
        this._currentRoom = 0
        this._rooms = [
            {
                description: "This is the first room",
                exits: [
                    {name: "East", idx: 1},
                    {name: "West", idx: 2}
                ]
            },
            {
                description: "in the east room",
                exits: [{name: "West", idx: 0}]
            }
        ]
    }

    get title() {
        return this._title
    }

    get currentRoom() {
        return this._rooms[this._currentRoom]
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
