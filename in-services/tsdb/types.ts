import {Map} from 'immutable';

/**
 * Number of milliseconds since start of epoch
 */
export type Timestamp = number;

export interface TimeWindow {
  from: Timestamp;
  to: Timestamp;
}

export type Snapshot = Map<string, any>;

export interface Point<TYPE_OF_Y> {
  x: number;
  y: TYPE_OF_Y;
}
