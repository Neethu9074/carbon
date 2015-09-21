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


const ON = 1;
const OFF = 0;

const stateLUT =                          // highlight selected active hidden indirect
[ [ [ [ [ 'inactive',                     // 0 0 0 0 0
          'inactive'],                    // 0 0 0 0 1
        [ 'hidden',                       // 0 0 0 1 0
          'hidden'] ],                    // 0 0 0 1 1
      [ [ 'initial',                      // 0 0 1 0 0
          'indirect'],                    // 0 0 1 0 1
        [ 'hidden',                       // 0 0 1 1 0
          'hidden'] ] ],                  // 0 0 1 1 1
    [ [ [ 'selectedInactive',             // 0 1 0 0 0
          'selectedInactive'],            // 0 1 0 0 1
        [ 'hidden',                       // 0 1 0 1 0
          'hidden'] ],                    // 0 1 0 1 1
      [ [ 'selected',                     // 0 1 1 0 0
          'selected'],                    // 0 1 1 0 1
        [ 'hidden',                       // 0 1 1 1 0
          'hidden'] ] ] ],                // 0 1 1 1 1
  [ [ [ [ 'highlightedInactive',          // 1 0 0 0 0
          'highlightedInactive'],         // 1 0 0 0 1
        [ 'hidden',                       // 1 0 0 1 0
          'hidden'] ],                    // 1 0 0 1 1
      [ [ 'highlighted',                  // 1 0 1 0 0
          'highlighted'],                 // 1 0 1 0 1
        [ 'hidden',                       // 1 0 1 1 0
          'hidden'] ] ],                  // 1 0 1 1 1
    [ [ [ 'selectedHighlightedInactive',  // 1 1 0 0 0
          'selectedHighlightedInactive'], // 1 1 0 0 1
        [ 'hidden',                       // 1 1 0 1 0
          'hidden'] ],                    // 1 1 0 1 1
      [ [ 'selectedHighlighted',          // 1 1 1 0 0
          'selectedHighlighted'],         // 1 1 1 0 1
        [ 'hidden',                       // 1 1 1 1 0
          'hidden'] ] ] ]                 // 1 1 1 1 1
];

export const PROPERTY_VALUES = {
  ON,
  OFF
};

export class StateMachine extends AStateMachine {

  constructor(owner) {
    super({
      stateProperties: {
        highlight: OFF,
        selected: OFF,
        indirect: OFF,
        hidden: OFF,
        active: OFF
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

  checkLUTAgainstCurrentProperties(LUT, stateProps) {
    const a = stateProps.highlight;
    const b = stateProps.selected;
    const c = stateProps.active;
    const d = stateProps.hidden;
    const e = stateProps.indirect;
    return LUT[a][b][c][d][e];
  }
}
