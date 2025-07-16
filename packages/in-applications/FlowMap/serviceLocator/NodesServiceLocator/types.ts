/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Subject } from '@instana/observables';
import RoEmitter from '@instana/roemitter';
interface Vector3 {
  x?: number;
  y?: number;
  z?: number;
}
type TopicIds =
  | 'heatMapColor'
  | 'metricValues'
  | 'data'
  | 'isExpanded_incoming'
  | 'isExpanded_outgoing'
  | 'screenPosition'
  | 'children'
  | 'paginationInformation'
  | 'transform'
  | 'isLoadingData_incoming'
  | 'isLoadingData_outgoing'
  | 'errors_incoming'
  | 'errors_outgoing';

type Topics = Record<TopicIds, unknown>;

type SubscriberObject = {
  subscriptions: unknown[];
  addSubscription: (subscription: unknown) => void;
  addSubscriptions: (subscriptions: unknown[]) => void;
  disposeSubscriptions: VoidFunction;
  dispose: VoidFunction;
};

type DataItem = {
  calls: number;
  errorRate: number;
  from: string;
  latency: string;
  to: number;
};
export interface Node {
  id: string;
  calls: number;
  applicationId: string;
  latency: number;
  serviceLocatorUid: string;
  incoming: Array<DataItem>;
  errors: number;
  heatMapColor?: string;
  outgoing: Array<DataItem>;
  position: Vector3;
  screenPosition: Vector3;
  children: Map<string, {}>;
  subscriber: SubscriberObject;
  events$: RoEmitter<Topics>;
  dispose: VoidFunction;
}

export type NodesCollection<T> = {
  add: (id: string, object: T) => void;
  has: (id: string) => boolean;
  get: (id: string) => T | undefined;
  remove: (id: string) => void;
  clear: () => void;
  stream: Subject<Map<string, T>>;
  objects: Map<string, T>;
};

export interface ServiceNullService {
  addNode: (id: string, object: Node) => void;
  removeNode: (id: string) => void;
  getNodes: () => NodesCollection<Node>;
  getNode: (id: string) => Node | undefined;
  dispose: VoidFunction;
}
