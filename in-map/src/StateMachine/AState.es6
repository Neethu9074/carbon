export default class AState {

  constructor(owner) {
    this.owner = owner;
  }

  enter() { throw new Error('PLEASE OVERRIDE METHOD'); }
  leave() { throw new Error('PLEASE OVERRIDE METHOD'); }
}
