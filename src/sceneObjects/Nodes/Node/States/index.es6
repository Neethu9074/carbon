'use strict';

import InitialState from '../../BaseNode/States/InitialState';
import HighlightedState from '../../BaseNode/States/HighlightedState';
import SelectedState from '../../BaseNode/States/SelectedState';
import InactiveState from './InactiveState';


export function setupStates(owner) {
  return {
    initial: new InitialState(owner),
    highlighted: new HighlightedState(owner),
    selected: new SelectedState(owner),
    inactive: new InactiveState(owner)
  };
}
