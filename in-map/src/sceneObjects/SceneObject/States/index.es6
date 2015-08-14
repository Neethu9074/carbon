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


export function setupStates(owner) {
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
