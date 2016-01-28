export default class AStateMachine {

  constructor({owner, stateProperties, stateLUT}) {
    this.stateProperties = stateProperties;
    this.stateLookUpTable = stateLUT;
    this.states = this.setupStates(owner);
    this.owner = owner;
  }

  setupStates() { throw new Error('PLEASE OVERRIDE METHOD'); }
  checkAgainstCurrentProperties() { throw new Error('PLEASE OVERRIDE METHOD'); }

  initialized() {
    this.owner.setStartingStateProperties();
  }

  getStateFromLUT() {
    const stateLUT = this.stateLookUpTable;
    const stateProps = this.stateProperties;

    return this.states[this.checkLUTAgainstCurrentProperties(stateLUT, stateProps)];
  }

  changeStateProperty(name, value) {
    if (this.stateProperties[name] !== value) {
      this.stateProperties[name] = value;
      this.updateState();
    }
  }

  updateState() {
    const oldState = this.state;
    const newState = this.getStateFromLUT();

    if (oldState !== newState) {
      if (oldState) {
        oldState.leave();
      }
      this.state = newState;
      if (!newState) {
        console.log('CANNOT FIND NEW STATE FOR', this.stateProperties);
      }
      newState.enter();
    }
  }
}
