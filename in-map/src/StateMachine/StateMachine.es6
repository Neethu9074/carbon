import AStateMachine from './AStateMachine';

import SelectedHighlightedState from './SelectedHighlightedState';
import IndirectHighlightedState from './IndirectHighlightedState';
import HighlightedState from './HighlightedState';
import SelectedState from './SelectedState';
import InactiveState from './InactiveState';
import InitialState from './InitialState';


const stateLUT =                    // a=active h=highlight s=selected i=indirect
[ [ [ [ 'inactive',                 // 0 0 0 0   - - - -
        'inactive'],                // 0 0 0 1   - - - i
      [ 'inactive',                 // 0 0 1 0   - - s -
        'inactive'] ],              // 0 0 1 1   - - s i
    [ [ 'inactive',                 // 0 1 0 0   - h - -
        'inactive'],                // 0 1 0 1   - h - i
      [ 'inactive',                 // 0 1 1 0   - h s -
        'inactive'] ] ],            // 0 1 1 1   - h s i
  [ [ [ 'initial',                  // 1 0 0 0   a - - -
        'highlighted'],             // 1 0 0 1   a - - i
      [ 'selected',                 // 1 0 1 0   a - s -
        'selected'] ],              // 1 0 1 1   a - s i
    [ [ 'highlighted',              // 1 1 0 0   a h - -
        'highlighted'],             // 1 1 0 1   a h - i
      [ 'selectedHighlighted',      // 1 1 1 0   a h s -
        'selectedHighlighted'] ] ]  // 1 1 1 1   a h s i
];

export const PROPERTY_VALUES = {
  ON: 1,
  OFF: 0
};

export const PROPERTIES = {
  HIGHLIGHT: 'highlight',
  SELECTED: 'selected',
  INDIRECT: 'indirect',
  ACTIVE: 'active'
};

export class StateMachine extends AStateMachine {

  constructor(owner) {
    super({
      stateProperties: {
        highlight: PROPERTY_VALUES.OFF,
        selected: PROPERTY_VALUES.OFF,
        indirect: PROPERTY_VALUES.OFF,
        active: PROPERTY_VALUES.OFF
      },
      stateLUT,
      owner
    });
  }

  setupStates(owner) {
    return {
      selectedHighlighted: new SelectedHighlightedState(owner),
      indirect: new IndirectHighlightedState(owner),
      highlighted: new HighlightedState(owner),
      selected: new SelectedState(owner),
      inactive: new InactiveState(owner),
      initial: new InitialState(owner)
    };
  }

  checkLUTAgainstCurrentProperties(LUT, stateProps) {
    return LUT
      [stateProps.active]
      [stateProps.highlight]
      [stateProps.selected]
      [stateProps.indirect];
  }
}
