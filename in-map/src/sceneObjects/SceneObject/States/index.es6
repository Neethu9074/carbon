import SelectedHighlightedInactiveState from './SelectedHighlightedInactiveState';
import HighlightedInactiveState from './HighlightedInactiveState';
import SelectedHighlightedState from './SelectedHighlightedState';
import SelectedInactiveState from './SelectedInactiveState';
import HighlightedState from './HighlightedState';
import SelectedState from './SelectedState';
import InactiveState from './InactiveState';
import InitialState from './InitialState';
import HiddenState from './HiddenState';


export function setupStates(owner) {
  return {
    initial: new InitialState(owner),
    highlighted: new HighlightedState(owner),
    selected: new SelectedState(owner),
    selectedHighlighted: new SelectedHighlightedState(owner),
    selectedHighlightedInactive: new SelectedHighlightedInactiveState(owner),
    selectedInactive: new SelectedInactiveState(owner),
    highlightedInactive: new HighlightedInactiveState(owner),
    inactive: new InactiveState(owner),
    hidden: new HiddenState(owner)
  };
}
