import React from 'react';

import LatencyDistributionChart from 'in-new-components/LatencyDistributionChart/LatencyDistributionChart';
import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-subscription/application/getLatencyDistributionBase10';
import getLatencyDistribution from 'in-subscription/application/getLatencyDistribution';
import { latencyDistributionBase10Enabled } from 'in-services/featureFlags';

export default function LatencyDistributionHistogram({
  timeConfig,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  includeSyntheticCalls,
  callType
}) {
  if (latencyDistributionBase10Enabled) {
    return (
      <LatencyDistributionBase10Chart
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        boundaryScope={boundaryScope}
        includeSyntheticCalls={includeSyntheticCalls}
        callType={callType}
        subscription={getLatencyDistributionBase10({
          maxLatencyBuckets: 80,
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
  return (
    <LatencyDistributionChart
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
