import React from 'react';

import LatencyDistributionChart from 'in-new-components/LatencyDistributionChart/LatencyDistributionChart';
import getLatencyDistribution from 'in-subscription/application/getLatencyDistribution';

export default function LatencyDistributionHistogram({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  includeSyntheticCalls,
  callType,
  renderPostChartContent
}) {
  return (
    <LatencyDistributionChart
      renderPostChartContent={renderPostChartContent}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      boundaryScope={boundaryScope}
      includeSyntheticCalls={includeSyntheticCalls}
      callType={callType}
      subscription={getLatencyDistribution({
        maxLatencyBuckets: 10,
        filter: {
          timeConfig,
          application: applicationId,
          service: serviceId,
          endpoint: endpointId,
          applicationBoundaryScope: boundaryScope,
          includeSyntheticCalls
        }
      })}
    />
  );
}
