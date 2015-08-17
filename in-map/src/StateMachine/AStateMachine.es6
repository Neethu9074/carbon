export default class AStateMachine {

  constructor({states, stateProperties, stateLUT}) {
    this.stateProperties = stateProperties;
    this.stateLookUpTable = stateLUT;
    this.states = states;

    this.state = states.initial;
  }

  checkAgainstCurrentProperties() {
    throw new Error('NOT IMPLEMENTED YET');
  }

  getStateFromLut() {
    const stateLUT = this.stateLookUpTable;
    for (let i = 0; i < stateLUT.length; i++) {
      const entry = stateLUT[i];
      if(this.checkAgainstCurrentProperties(entry[0])) {
        return this.states[entry[1]];
      }
    }
  }

  changeStateProperty(name, value) {
    if(this.stateProperties[name] !== value) {
      this.stateProperties[name] = value;
      this.updateState();
    }
  }

  updateState() {
    const oldState = this.state;
    const newState = this.getStateFromLut();

    if(oldState !== newState) {
      oldState.leave();
      this.state = newState;
      newState.enter();
    }
  }
}
