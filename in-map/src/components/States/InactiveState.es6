import State from './State';

export default class InactiveState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onInactiveEnter();
  }

  leave() {
    this.owner.onInactiveLeave();
  }
}
