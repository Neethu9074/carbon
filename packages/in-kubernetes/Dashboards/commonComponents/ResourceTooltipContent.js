import React from 'react';

import { resourceQuotaBytes, resourceQuotaNumber } from 'in-kubernetes/formatters';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import MetricValue from 'in-components/MetricValue';

export default function ResourceTooltipContent({
  snapshotId,
  cpuReqMetric,
  cpuLimitsMetric,
  memReqMetric,
  memLimitsMetric,
  cpuReqMetricFormatter = resourceQuotaNumber,
  cpuLimitsMetricFormatter = resourceQuotaNumber,
  memReqMetricFormatter = resourceQuotaBytes,
  memLimitsMetricFormatter = resourceQuotaBytes
}) {
  return (
    <DescriptionList>
      <DescriptionItem title="CPU">
        <Dl>
          <Di title="Requests">
            <MetricValue snapshotId={snapshotId} metric={cpuReqMetric} formatter={cpuReqMetricFormatter} />
          </Di>
          <Di title="Limit">
            <MetricValue snapshotId={snapshotId} metric={cpuLimitsMetric} formatter={cpuLimitsMetricFormatter} />
          </Di>
        </Dl>
      </DescriptionItem>
      <DescriptionItem title="Memory">
        <Dl>
          <Di title="Requests">
            <MetricValue snapshotId={snapshotId} metric={memReqMetric} formatter={memReqMetricFormatter} />
          </Di>
          <Di title="Limit">
            <MetricValue snapshotId={snapshotId} metric={memLimitsMetric} formatter={memLimitsMetricFormatter} />
          </Di>
        </Dl>
      </DescriptionItem>
    </DescriptionList>
  );
}
