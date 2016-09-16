

module.exports = class Player {
  constructor() {
    this._name = ""
    this._hp = 100
    this._maxHp = 100
  }

  get status() {
    const hpPerc = this._hp/this._maxHp

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

  get name() {
    return this._name
  }

  set name(name) {
    this._name = name
  }

  get hp(){
    return this._hp
  }

  set hp(hp) {
    if (hp > this._maxHp) {
      hp = this._maxHp
    }
    this._hp = hp
  }
}