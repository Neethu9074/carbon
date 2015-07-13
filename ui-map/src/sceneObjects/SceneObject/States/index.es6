'use strict';

import InitialState from './InitialState';
import HighlightedState from './HighlightedState';
import SelectedState from './SelectedState';
import InactiveState from './InactiveState';


export function setupStates(owner) {
  return {
    initial: new InitialState(owner),
    highlighted: new HighlightedState(owner),
    selected: new SelectedState(owner),
    inactive: new InactiveState(owner)
  };
}
