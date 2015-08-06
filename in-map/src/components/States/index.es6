'use strict';

import InitialState from './InitialState';
import InactiveState from './InactiveState';

export function setupStates(owner) {
  return {
    initial: new InitialState(owner),
    inactive: new InactiveState(owner)
  };
}
