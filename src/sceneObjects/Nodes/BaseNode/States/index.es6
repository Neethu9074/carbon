'use strict';

import InitialState from './Initial';
import HighlightedState from './Highlighted';
import SelectedState from './Selected';


export function setupStates(owner) {
  return {
    initial: new InitialState(owner),
    highlighted: new HighlightedState(owner),
    selected: new SelectedState(owner)
  };
}
