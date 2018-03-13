import React from 'react';

import getLatencyDistribution from 'in-subscription/application/getLatencyDistribution';
import HistogramCardWrapper from 'in-new-components/Histogram/HistogramCardWrapper';

export default function LatencyDistributionHistogram({ timeframe, applicationId, serviceId, endpointId, cardTitle }) {
  return (
    <HistogramCardWrapper
      cardTitle={cardTitle}
      metricId="calls"
      subscription={getLatencyDistribution({
        maxLatencyBuckets: 10,
        filter: {
          timeframe,
          application: applicationId,
          service: serviceId,
          endpoint: endpointId
        }
      })}
    />
  );
}
