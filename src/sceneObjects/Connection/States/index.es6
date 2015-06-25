'use strict';

import InitialState from './InitialState';
import HighlightedState from './HighlightedState';


export function setupStates(owner) {
  return {
    initial: new InitialState(owner),
    highlighted: new HighlightedState(owner)
  };
}
