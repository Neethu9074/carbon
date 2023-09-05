/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Subject } from '@instana/observables';

export interface Node {
  id: string;
  calls: number;
  applicationId: string;
  latency: number;
  serviceLocatorUid: string;
  incoming: [];
  errors: number;
  heatMapColor?: string;
  outgoing: [];
}

export interface NodesCollection {
  add: (id: string, object: Node) => void;
  has: (id: string) => boolean;
  get: (id: string) => Node | undefined;
  remove: (id: string) => void;
  clear: () => void;
  stream: Subject<Map<string, Node>>;
  objects: Map<string, Node>;
}

export interface ServiceNullService {
  addNode: (id: string, object: Node) => void;
  removeNode: (id: string) => void;
  getNodes: () => NodesCollection;
  getNode: (id: string) => Node;
  dispose: VoidFunction;
}
