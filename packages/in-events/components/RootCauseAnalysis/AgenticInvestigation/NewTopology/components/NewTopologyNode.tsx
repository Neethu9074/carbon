/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { FC, useMemo } from 'react';
import classNames from 'classnames';

import { ShapeNode } from '@instana/carbon-charts';
import { SvgIcon } from '@instana/components';

import {
  NodeWithId,
  TopologyNode as TopologyNodeType
} from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/types';
import determineEntityTypeFromEntityIDMap from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import useGetEntityLabel from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/hooks/useGetEntityLabel';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import { getIconForRCADisplay } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';

import locals from './NewTopologyNode.mless';

interface TopologyNodeProps {
  node: TopologyNodeType;
}

/**
 * Get the appropriate icon for the entity type
 */
const getEntityIcon = (originalNode: any) => {
  if (!originalNode) return 'lib_infra_unknownIcon';

  const pluginId = originalNode.pluginId;
  const shortPluginName = translateFullyQualifiedPluginToShortPluginName(pluginId);

  const entityType = determineEntityTypeFromEntityIDMap(originalNode);

  return getIconForRCADisplay(entityType, shortPluginName ?? pluginId);
};

/**
 * Intelligently truncate a string if it exceeds the maximum length
 * @param text The text to truncate
 * @param maxLength The maximum length before truncation
 * @returns The truncated text with ellipsis if needed
 */
const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) {
    return text;
  }

  // Check if the text contains slashes (like in service paths)
  if (text.includes('/')) {
    const parts = text.split('/');
    // If we have a path-like structure, keep the last part and truncate the beginning
    if (parts.length > 1) {
      const lastPart = parts.slice(-3).join('/');
      // If the last part is short enough, show it completely
      if (lastPart.length <= maxLength - 3) {
        // -3 for "..."
        return `.../${lastPart}`;
      }
    }
  }

  // Check if the text contains dots (like in domain names or package paths)
  if (text.includes('.')) {
    const parts = text.split('.');
    // If we have a domain-like structure, keep important parts
    if (parts.length > 1) {
      const lastParts = parts.slice(-2).join('.');
      if (lastParts.length <= maxLength - 3) {
        return `...${lastParts}`;
      }
    }
  }

  // Default truncation - show the beginning and end of the string
  if (maxLength > 10) {
    const frontChars = Math.floor(maxLength / 2) - 1;
    const endChars = maxLength - frontChars - 3; // -3 for "..."
    return `${text.substring(0, frontChars)}...${text.substring(text.length - endChars)}`;
  }

  // For very short maxLength, just truncate the end
  return `${text.substring(0, maxLength)}...`;
};

const getNodeId = (originalNode?: NodeWithId) => {
  if (!originalNode) return '';

  const entityType = determineEntityTypeFromEntityIDMap(originalNode);

  return entityType === 'infrastructure' || entityType === 'process' ? originalNode.snapshotId : originalNode.steadyId;
};

/**
 * Component for rendering a single node in the topology visualization
 */
const TopologyNode: FC<TopologyNodeProps> = ({ node }) => {
  const originalNode = node.originalNode;

  if (!originalNode) return null;

  // Use our custom hook to get entity data for label
  const entityData = useGetEntityLabel(originalNode);

  const label = entityData?.label || 'unknown';

  // Create a truncated version of the label for display
  // Use a larger maxLength for the topology nodes to accommodate more text
  const displayLabel = useMemo(() => truncateText(label, 30), [label]);

  // Check if the node has the "rca" tag in its tags array
  const isRootCause = originalNode?.tags?.includes('rca');
  const isTriggeringEntity = originalNode?.tags?.includes('triggering');

  const { selectedEntityId, setSelectedEntityId } = useEntitySelection();

  const isEntitySelected = selectedEntityId === originalNode?.steadyId || selectedEntityId === originalNode?.snapshotId;

  const entityIcon = getEntityIcon(originalNode);

  return (
    <foreignObject x={node.x} y={node.y} height={node.height} width={node.width} style={{ overflow: 'visible' }}>
      <div style={{ height: node.height, width: node.width }}>
        <div title={label} className={locals.nodeWrapper}>
          <ShapeNode
            renderIcon={<SvgIcon type={entityIcon} color={isRootCause ? 'white' : undefined} />}
            size="100%"
            title={displayLabel}
            id={node.id}
            onClick={() => {
              setSelectedEntityId(getNodeId(originalNode));
            }}
            className={classNames({
              [locals.NodeBase]: true,
              [locals.triggeringEntityNode]: isTriggeringEntity,
              [locals.rootCauseEntityNode]: isRootCause,
              [locals.regularNode]: !isRootCause && !isTriggeringEntity,
              [locals.selectedNode]: isEntitySelected
            })}
          />
        </div>
      </div>
    </foreignObject>
  );
};

export default TopologyNode;
