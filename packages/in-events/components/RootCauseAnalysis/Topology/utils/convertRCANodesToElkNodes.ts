/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';

import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import { NodesMap } from 'in-events/components/legacy/TopologyUtils';

const nodeSize = 52;

const nodePriorities = {
  application: '1',
  service: '2',
  superService: '2',
  endpoint: '3',
  infrastructure: '3',
  default: '4'
};

const convertRCANodesToElkNodes = (nodes: NodesMap): TopologyGraphNode[] => {
  return Object.values(nodes).map(node => {
    const { id, entityType, label, tags } = node;

    return {
      id,
      entityType,
      metadata: { ...node },
      height: nodeSize,
      width: nodeSize,
      label,
      tags,
      layoutOptions: {
        'partitioning.partition': get(nodePriorities, entityType, nodePriorities.default)
      }
    };
  });
};

export default convertRCANodesToElkNodes;
