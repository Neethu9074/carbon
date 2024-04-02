/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export interface NodeCollection {
  applicationId: string;
  children: Map<any, any>;
  data: {
    entityType: string;
    snapShotIds: string[];
    technologies: string[];
    types: string[];
  };
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
}
