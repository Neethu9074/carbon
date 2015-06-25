'use strict';

import InitialState from './Initial';
import HighlightedState from './Highlighted';


export function setupStates(owner) {
  return {
    initial: new InitialState(owner),
    highlighted: new HighlightedState(owner)
  };
}
