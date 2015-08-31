import {Map, List} from 'immutable';

/**
 * Number of milliseconds since start of epoch
 */
export type Timestamp = number;

export type Snapshot = Map<string, any>;
export type MutableSnapshot = {
  pluginId: string,
  hostId: string,
  steadyId: string,
  id?: string,
  data: Object
};

export type SnapshotId = string;

export type SnapshotCoordinates = Map<string, any>;
export type MutableSnapshotCoordinates = {
  pluginId: string,
  hostId: string,
  steadyId: string,
  id?: string
};

export interface WiringEdge {
  source: SnapshotId,
  destination: SnapshotId,
  relation: string
}
export interface WiringGraph {
  nodes: {SnapshotId: SnapshotCoordinates}
  edges: WiringEdge[]
}
