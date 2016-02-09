import AState from './AState';


export default class IndirectHighlightedState extends AState {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.onIndirectHighlightEnter();
  }

  leave() {
    this.owner.onIndirectHighlightLeave();
  }
}
