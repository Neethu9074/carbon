/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import UpstreamDownstreamButton from 'in-new-components/UpstreamDownstream/UpstreamDownstreamButton';
import StackButton from 'in-new-components/Stack/StackButton';

import locals from './ContextGuide.mless';

export default function ContextGuide({
  id,
  serviceId,
  applicationId,
  boundaryScope,
  endpointId,
  timeConfig,
  productArea,
  tagFilters,
  includeSelfEntity = false,
  plugin
}) {
  return (
    <>
      <StackButton
        id={id}
        applicationId={applicationId}
        boundaryScope={boundaryScope}
        serviceId={serviceId}
        timeConfig={timeConfig}
        productArea={productArea}
        className={locals.leftButton}
        includeSelfEntity={includeSelfEntity}
        plugin={plugin}
        noAutoMargin
      />
      <UpstreamDownstreamButton
        snapshotId={id}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        className={locals.rightButton}
        tagFilters={tagFilters}
        plugin={plugin}
      />
    </>
  );
}
