import React from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import MetricValue from 'in-components/MetricValue';

export default function ResourceTooltipContent({
  snapshotId,
  cpuReqMetric,
  cpuLimitsMetric,
  memReqMetric,
  memLimitsMetric,
  cpuReqMetricFormatter,
  cpuLimitsMetricFormatter,
  memReqMetricFormatter,
  memLimitsMetricFormatter
}) {
  return (
    <DescriptionList>
      <DescriptionItem title="CPU">
        <Dl>
          <Di title="Requests">
            <MetricValue
              snapshotId={snapshotId}
              metric={cpuReqMetric}
              formatter={cpuReqMetricFormatter || twoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </Di>
          <Di title="Limit">
            <MetricValue
              snapshotId={snapshotId}
              metric={cpuLimitsMetric}
              formatter={cpuLimitsMetricFormatter || twoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </Di>
        </Dl>
      </DescriptionItem>
      <DescriptionItem title="Memory">
        <Dl>
          <Di title="Requests">
            <MetricValue
              snapshotId={snapshotId}
              metric={memReqMetric}
              formatter={memReqMetricFormatter || bytesTwoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </Di>
          <Di title="Limit">
            <MetricValue
              snapshotId={snapshotId}
              metric={memLimitsMetric}
              formatter={memLimitsMetricFormatter || bytesTwoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </Di>
        </Dl>
      </DescriptionItem>
    </DescriptionList>
  );
}
