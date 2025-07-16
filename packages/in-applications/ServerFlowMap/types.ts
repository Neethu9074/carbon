/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Service } from 'in-types';

export interface NodeCollection {
  applicationId?: string;
  children: Map<string, NodeCollection>;
  data: Service;
  errors: any;
  hasrelatedNodes: {
    outgoing: boolean;
    incoming: boolean;
  };
  id: string;
  incoming: Array<NodeCollection>;
  isLoading: boolean;
  metrciValues: {
    latencyAgg: Array<Array<number>>;
    errosAgg: Array<Array<number>>;
    callsAgg: Array<Array<number>>;
  };
  outgoing: Array<NodeCollection>;
  nodeId?: string;
  __originalId?: string;
}
