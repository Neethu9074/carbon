import AStateMachine from './AStateMachine';

import SelectedHighlightedInactiveState from './SelectedHighlightedInactiveState';
import HighlightedInactiveState from './HighlightedInactiveState';
import SelectedHighlightedState from './SelectedHighlightedState';
import IndirectHighlightedState from './IndirectHighlightedState';
import SelectedInactiveState from './SelectedInactiveState';
import HighlightedState from './HighlightedState';
import SelectedState from './SelectedState';
import InactiveState from './InactiveState';
import InitialState from './InitialState';
import HiddenState from './HiddenState';


const ON = true;
const OFF = false;

const stateLUT = [
  //highlight   selected  active    hidden    indirect  result state
  [[OFF,        OFF,      ON,        OFF,     OFF],     'initial'],
  [[OFF,        ON,       ON,        OFF,     OFF],     'selected'],
  [[ON,         OFF,      ON,        OFF,     OFF],     'highlighted'],
  [[ON,         ON,       ON,        OFF,     OFF],     'selectedHighlighted'],
  [[OFF,        ON,       OFF,       OFF,     OFF],     'selectedInactive'],
  [[ON,         OFF,      OFF,       OFF,     OFF],     'highlightedInactive'],
  [[ON,         ON,       OFF,       OFF,     OFF],     'selectedHighlightedInactive'],
  [[OFF,        OFF,      OFF,       OFF,     OFF],     'inactive'],
  [[OFF,        OFF,      ON,        ON,      OFF],     'hidden'],
  [[OFF,        ON,       ON,        ON,      OFF],     'hidden'],
  [[ON,         OFF,      ON,        ON,      OFF],     'hidden'],
  [[ON,         ON,       ON,        ON,      OFF],     'hidden'],
  [[OFF,        ON,       OFF,       ON,      OFF],     'hidden'],
  [[ON,         OFF,      OFF,       ON,      OFF],     'hidden'],
  [[ON,         ON,       OFF,       ON,      OFF],     'hidden'],
  [[OFF,        OFF,      OFF,       ON,      OFF],     'hidden'],
  [[OFF,        OFF,      ON,        OFF,     ON],      'indirect'],
  [[OFF,        ON,       ON,        OFF,     ON],      'selected'],
  [[ON,         OFF,      ON,        OFF,     ON],      'highlighted'],
  [[ON,         ON,       ON,        OFF,     ON],      'selectedHighlighted'],
  [[OFF,        ON,       OFF,       OFF,     ON],      'selectedInactive'],
  [[ON,         OFF,      OFF,       OFF,     ON],      'highlightedInactive'],
  [[ON,         ON,       OFF,       OFF,     ON],      'selectedHighlightedInactive'],
  [[OFF,        OFF,      OFF,       OFF,     ON],      'inactive'],
  [[OFF,        OFF,      ON,        ON,      ON],      'hidden'],
  [[OFF,        ON,       ON,        ON,      ON],      'hidden'],
  [[ON,         OFF,      ON,        ON,      ON],      'hidden'],
  [[ON,         ON,       ON,        ON,      ON],      'hidden'],
  [[OFF,        ON,       OFF,       ON,      ON],      'hidden'],
  [[ON,         OFF,      OFF,       ON,      ON],      'hidden'],
  [[ON,         ON,       OFF,       ON,      ON],      'hidden'],
  [[OFF,        OFF,      OFF,       ON,      ON],      'hidden']
];

export const PROPERTY_VALUES = {
  ON,
  OFF
};

export class StateMachine extends AStateMachine {

  constructor(owner) {
    super({
      stateProperties: {
        highlight: PROPERTY_VALUES.OFF,
        selected: PROPERTY_VALUES.OFF,
        indirect: PROPERTY_VALUES.OFF,
        hidden: PROPERTY_VALUES.OFF,
        active: PROPERTY_VALUES.OFF
      },
      stateLUT,
      owner
    });
  }

  setupStates(owner) {
    return {
      selectedHighlightedInactive: new SelectedHighlightedInactiveState(owner),
      selectedHighlighted: new SelectedHighlightedState(owner),
      highlightedInactive: new HighlightedInactiveState(owner),
      selectedInactive: new SelectedInactiveState(owner),
      indirect: new IndirectHighlightedState(owner),
      highlighted: new HighlightedState(owner),
      selected: new SelectedState(owner),
      inactive: new InactiveState(owner),
      initial: new InitialState(owner),
      hidden: new HiddenState(owner)
    };
  }

  checkAgainstCurrentProperties(flags) {
    const stateProps = this.stateProperties;
    if(stateProps.highlight === flags[0] &&
       stateProps.selected === flags[1] &&
       stateProps.active === flags[2] &&
       stateProps.hidden === flags[3] &&
       stateProps.indirect === flags[4]
    ) {
      return true;
    }
    return false;
  }
}
