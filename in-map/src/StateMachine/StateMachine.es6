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


/*eslint-disable no-multi-spaces*/
const stateLUT = [
  //highlight,  selected,   active    hidden    indirect  result state
  [[false,      false,      true,     false,    false],   'initial'],
  [[false,      true,       true,     false,    false],   'selected'],
  [[true,       false,      true,     false,    false],   'highlighted'],
  [[true,       true,       true,     false,    false],   'selectedHighlighted'],
  [[false,      true,       false,    false,    false],   'selectedInactive'],
  [[true,       false,      false,    false,    false],   'highlightedInactive'],
  [[true,       true,       false,    false,    false],   'selectedHighlightedInactive'],
  [[false,      false,      false,    false,    false],   'inactive'],
  [[false,      false,      true,     true,     false],   'hidden'],
  [[false,      true,       true,     true,     false],   'hidden'],
  [[true,       false,      true,     true,     false],   'hidden'],
  [[true,       true,       true,     true,     false],   'hidden'],
  [[false,      true,       false,    true,     false],   'hidden'],
  [[true,       false,      false,    true,     false],   'hidden'],
  [[true,       true,       false,    true,     false],   'hidden'],
  [[false,      false,      false,    true,     false],   'hidden'],
  [[false,      false,      true,     false,    true],    'indirect'],
  [[false,      true,       true,     false,    true],    'selected'],
  [[true,       false,      true,     false,    true],    'highlighted'],
  [[true,       true,       true,     false,    true],    'selectedHighlighted'],
  [[false,      true,       false,    false,    true],    'selectedInactive'],
  [[true,       false,      false,    false,    true],    'highlightedInactive'],
  [[true,       true,       false,    false,    true],    'selectedHighlightedInactive'],
  [[false,      false,      false,    false,    true],    'inactive'],
  [[false,      false,      true,     true,     true],    'hidden'],
  [[false,      true,       true,     true,     true],    'hidden'],
  [[true,       false,      true,     true,     true],    'hidden'],
  [[true,       true,       true,     true,     true],    'hidden'],
  [[false,      true,       false,    true,     true],    'hidden'],
  [[true,       false,      false,    true,     true],    'hidden'],
  [[true,       true,       false,    true,     true],    'hidden'],
  [[false,      false,      false,    true,     true],    'hidden']
];
/*eslint-enable no-multi-spaces*/

export default class StateMachine extends AStateMachine {

  constructor(owner) {
    super({
      stateProperties: {
        highlight: false,
        selected: false,
        indirect: false,
        hidden: false,
        active: true
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
