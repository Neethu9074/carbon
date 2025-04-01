/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ElkNode } from 'elkjs/lib/elk-api';

import { QualifiedRCAEntityTypes } from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import { RCA_TOPOLOGY_ENTITY_TYPE_TAGS, RCA_TOPOLOGY_TAGS } from 'in-events/components/legacy/TopologyUtils';

export interface TopologyGraphNode extends ElkNode {
  entityType: QualifiedRCAEntityTypes | RCA_TOPOLOGY_ENTITY_TYPE_TAGS;
  label: string;
  metadata: any;
  tags: Set<RCA_TOPOLOGY_TAGS>;
}
