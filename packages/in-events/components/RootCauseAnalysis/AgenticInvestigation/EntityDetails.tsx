/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { ProductiveCard } from '@carbon/ibm-products';
// eslint-disable-next-line no-restricted-imports
import { Tag } from '@carbon/react';
import React from 'react';

import { Typography } from '@instana/components';

import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import TopologyContextMenu from 'in-events/components/RootCauseAnalysis/Topology/TopologyContextMenu';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/AgenticInvestigation.mless';

const EntityDetails = () => {
  const { selectedEntityId } = useEntitySelection();
  const { nodes } = useRootCauseTopologyDataContext();

  if (!selectedEntityId) {
    return (
      <ProductiveCard
        className={locals.cardWithBorder}
        title="No entity selected"
        description="Select an entity to view its details"
      >
        <div />
      </ProductiveCard>
    );
  }

  // Find the selected node in the topology data (nodes is a NodesMap object with IDs as keys)
  const selectedNodeInfo = selectedEntityId ? nodes[selectedEntityId] : undefined;

  // Check if the node is a root cause (has the 'RCA' tag)
  const isRootCause = selectedNodeInfo?.tags?.has('RCA');

  if (!selectedNodeInfo || isRootCause) {
    return (
      <ProductiveCard
        className={locals.cardWithBorder}
        title={selectedNodeInfo?.label}
        description={<Tag type="purple">Root cause</Tag>}
      >
        <Typography variant="body-01">This section is WIP.</Typography>
      </ProductiveCard>
    );
  }

  // Convert nodeInfo to TopologyGraphNode format
  const selectedNode: TopologyGraphNode = {
    id: selectedNodeInfo.id,
    entityType: selectedNodeInfo.entityType,
    label: selectedNodeInfo.label,
    tags: selectedNodeInfo.tags,
    metadata: { ...selectedNodeInfo }
  };

  return (
    <ProductiveCard className={locals.cardWithBorder} title={selectedNode.label}>
      <TopologyContextMenu node={selectedNode} />
    </ProductiveCard>
  );
};

export default EntityDetails;
