/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { FC } from 'react';

import SimpleTopologyVisualization from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/components/SimpleTopologyVisualization';
import { getEdgesAndNodes } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/utils/topologyUtils';
import { NewTopologyProps } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/types';

/**
 * Component for displaying a topology visualization of incident data
 */
const NewTopology: FC<NewTopologyProps> = ({ incident }) => {
  const { edges, nodes } = getEdgesAndNodes(incident);

  return (
    <div>
      <SimpleTopologyVisualization nodes={nodes} edges={edges} width="100%" height="800px" />
    </div>
  );
};

export default NewTopology;
