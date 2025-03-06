/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkNode } from 'elkjs/lib/elk-api';

import { RCA_TOPOLOGY_TAGS } from 'in-events/components/legacy/TopologyUtils';

export interface TopologyGraphNode extends ElkNode {
  entityType: string;
  label: string;
  metadata: any;
  tags: Set<RCA_TOPOLOGY_TAGS>;
}
