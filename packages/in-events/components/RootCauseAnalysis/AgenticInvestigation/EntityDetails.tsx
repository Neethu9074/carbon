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

import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import RootCauseEntityDetails from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseEntityDetails';
import TopologyContextMenu from 'in-events/components/RootCauseAnalysis/Topology/TopologyContextMenu';
import { TopologyGraphNode } from 'in-events/components/RootCauseAnalysis/Topology/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/AgenticInvestigation.mless';

const EntityDetails = () => {
  const { selectedEntityId } = useEntitySelection();
  const { nodes } = useRootCauseTopologyDataContext();

  if (!selectedEntityId) {
    return (
      <ProductiveCard
        className={locals.cardWithBorder}
        title={t('in-events:RCA.singleEntityLLM.entityDetails.noEntitySelectedTitle')}
        description={t('in-events:RCA.singleEntityLLM.entityDetails.noEntitySelectedDescription')}
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
        description={<Tag type="purple">{t('in-events:RCA.titlePRCA')}</Tag>}
        aiLabel={<></>}
      >
        <RootCauseEntityDetails />
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
