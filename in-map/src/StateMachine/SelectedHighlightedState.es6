import AState from './AState';


export default class SelectedHighlightedState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onSelectedHighlightEnter();
  }

  leave() {
    this.owner.onSelectedHighlightLeave();
  }
}
