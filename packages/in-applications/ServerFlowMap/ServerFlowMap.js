/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import withFlowMapResultState from 'in-applications/ServerFlowMap/withFlowMapResultState';
import FlowMap3DPresentation from 'in-applications/FlowMap';

function ServerFlowMap(props) {
  const {
    height,
    rootNodeData,
    serviceId,
    applicationId,
    endpointId,
    timeConfig,
    getFlowNodes,
    collapseLeft,
    collapseRight,
    flowMapStateVersion,
    flowMapState
  } = props;

  return (
    <FlowMap3DPresentation
      customHeight={height}
      flowMapStateVersion={flowMapStateVersion}
      flowMapState={flowMapState}
      rootNodeData={rootNodeData}
      serviceId={serviceId}
      applicationId={applicationId}
      endpointId={endpointId}
      timeConfig={timeConfig}
      getFlowNodes={getFlowNodes}
      collapseLeft={collapseLeft}
      collapseRight={collapseRight}
    />
  );
}

export default withFlowMapResultState()(ServerFlowMap);
