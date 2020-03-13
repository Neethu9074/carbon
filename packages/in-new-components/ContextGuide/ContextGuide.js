import React from 'react';

import UpstreamDownstreamButton from 'in-new-components/UpstreamDownstream/UpstreamDownstreamButton';
import StackButton from 'in-new-components/Stack/StackButton';

import locals from './ContextGuide.mless';

export default function ContextGuide({
  id,
  serviceId,
  applicationId,
  endpointId,
  boundaryScope,
  timeConfig,
  productArea
}) {
  return (
    <>
      <StackButton
        id={id}
        applicationId={applicationId}
        timeConfig={timeConfig}
        productArea={productArea}
        className={locals.leftButton}
        noAutoMargin
      />
      <UpstreamDownstreamButton
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeConfig={timeConfig}
        boundaryScope={boundaryScope}
        productArea={productArea}
        className={locals.rightButton}
      />
    </>
  );
}
