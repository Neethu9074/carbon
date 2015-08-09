

import NearestState from './NearestState';
import NearState from './NearState';
import MidState from './MidState';

export function setupStates(owner) {
  return {
    nearest: new NearestState(owner),
    near: new NearState(owner),
    mid: new MidState(owner)
  };
}
