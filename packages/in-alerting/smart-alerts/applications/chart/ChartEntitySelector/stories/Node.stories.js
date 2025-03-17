/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  leafNode,
  nodeWithKids
} from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/stories/treeSelectionData';
import EntityItemNode from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/EntityItemNode';
import Node from 'in-components/SelectorOverlay/Node';

export default {
  component: Node,
  subcomponents: { EntityItemNode }
};

export const AutoLoadingChildrenSingleRow = {
  render: () => <EntityItemNode node={nodeWithKids} withIcons />
};

export const AutoLoadingLeafSingleRow = {
  render: () => <EntityItemNode node={leafNode} withIcons />
};

export const StaticNodeWithChildrenSingleRow = {
  render: () => <Node node={nodeWithKids} asListGroup={false} withIcons />
};

export const StaticNodeLeafSingleRow = {
  render: () => <Node node={leafNode} asListGroup={false} withIcons />
};
