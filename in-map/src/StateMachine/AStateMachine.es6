export default class AStateMachine {

  constructor({owner, stateProperties, stateLUT}) {
    this.stateProperties = stateProperties;
    this.stateLookUpTable = stateLUT;
    this.states = this.setupStates(owner);
    this.owner = owner;
  }

  initialized() {
    this.owner.setStartingStateProperties();
  }

  setupStates() {
    throw new Error('NOT IMPLEMENTED YET');
  }

  checkAgainstCurrentProperties() {
    throw new Error('NOT IMPLEMENTED YET');
  }

  getStateFromLUT() {
    const stateLUT = this.stateLookUpTable;
    const stateProps = this.stateProperties;

    return this.states[this.checkLUTAgainstCurrentProperties(stateLUT, stateProps)];
  }

  changeStateProperty(name, value) {
    if(this.stateProperties[name] !== value) {
      this.stateProperties[name] = value;
      this.updateState();
    }
  }

  updateState() {
    const oldState = this.state;
    const newState = this.getStateFromLUT();

    if(oldState !== newState) {
      if(oldState) {
        oldState.leave();
      }
      this.state = newState;
      newState.enter();
    }
  }
}
