import React from 'react';

import { twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import MetricValue from 'in-components/MetricValue';

export default function PodResourceTooltipContent({ podId: snapshotId }) {
  return (
    <DescriptionList>
      <DescriptionItem title="CPU">
        <Dl>
          <Di title="Requests">
            <MetricValue
              snapshotId={snapshotId}
              metric="cpuRequests"
              formatter={twoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </Di>
          <Di title="Limit">
            <MetricValue
              snapshotId={snapshotId}
              metric="cpuLimits"
              formatter={twoDecimalPlaces}
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
              metric="memoryRequests"
              formatter={bytesTwoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </Di>
          <Di title="Limit">
            <MetricValue
              snapshotId={snapshotId}
              metric="memoryLimits"
              formatter={bytesTwoDecimalPlaces}
              timeWindowAggregation="mean"
            />
          </Di>
        </Dl>
      </DescriptionItem>
    </DescriptionList>
  );
}
