import {Map} from 'immutable';

export type Timestamp = number;

export type Snapshot = Map<string, any>;

export interface Point<TYPE_OF_Y> {
  x: number;
  y: TYPE_OF_Y;
}
