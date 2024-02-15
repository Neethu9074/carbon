/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import Controls from 'in-applications/FlowMap/components/Controls/Controls';
import Nodes from 'in-applications/FlowMap/components/Nodes/Nodes';

import locals from 'in-applications/FlowMap/misc/OverlayReactComponentMounter.mless';

function MapOverlay(props, ref) {
  const {
    serviceLocatorUid,
    expandNodeLeft,
    expandNodeRight,
    expandChildLeft,
    expandChildRight,
    loadMore,
    resultPrecisionDetails,
    rootNodeData
  } = props;
  return serviceLocatorUid ? (
    <div ref={ref} className={locals.wrapper}>
      <Nodes
        serviceLocatorUid={serviceLocatorUid}
        expandNodeLeft={expandNodeLeft}
        expandNodeRight={expandNodeRight}
        expandChildLeft={expandChildLeft}
        expandChildRight={expandChildRight}
        loadMore={loadMore}
      />
      <Controls
        serviceLocatorUid={serviceLocatorUid}
        resultPrecisionDetails={resultPrecisionDetails}
        entity={rootNodeData.endpoint != null ? 'endpoint' : 'service'}
      />
    </div>
  ) : (
    <div ref={ref} />
  );
}

export default forwardRef(MapOverlay);
