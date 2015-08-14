import State from './State';

export default class IndirectHighlightedState extends State {

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
