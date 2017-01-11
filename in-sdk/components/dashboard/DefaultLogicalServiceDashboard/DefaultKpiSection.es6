import irpt from 'react-immutable-proptypes';
import React from 'react';

import {msTwoDecimalPlaces, zeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import TimeWindowSizeLabel from 'in-components/TimeWindowSizeLabel';
import MetricValue from 'in-components/MetricValue';
import {getLabel} from 'in-sdk/snapshot';


export default function DefaultKpiSection({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiHeading>
        {getLabel(snapshot)}
      </KpiHeading>
      <KpiKeyValue label='calls/s'>
        <MetricValue snapshotId={snapshotId}
                     metric='count'
                     formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={<TimeWindowSizeLabel prefix='#calls in ' />}>
        <MetricValue snapshotId={snapshotId}
                     formatter={zeroDecimalPlaces}
                     metric='count'
                     timeWindowAggregation='adjustedCount' />
      </KpiKeyValue>
      <KpiKeyValue label='avg. latency'>
        <MetricValue snapshotId={snapshotId}
                     metric='duration.mean'
                     formatter={msTwoDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={<TimeWindowSizeLabel prefix='avg. latency in ' />}>
        <MetricValue snapshotId={snapshotId}
                     formatter={msTwoDecimalPlaces}
                     metric='duration.mean'
                     timeWindowAggregation='mean' />
      </KpiKeyValue>
      <KpiKeyValue label='error rate'>
        <MetricValue snapshotId={snapshotId}
                     metric='error_rate'
                     formatter={percentageTwoDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label={<TimeWindowSizeLabel prefix='error rate in ' />}>
        <MetricValue snapshotId={snapshotId}
                     metric='error_rate'
                     formatter={percentageTwoDecimalPlaces}
                     timeWindowAggregation='mean' />
      </KpiKeyValue>
      <KpiKeyValue label='instances'>
        <MetricValue snapshotId={snapshotId}
                     metric='instances'
                     formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}

DefaultKpiSection.propTypes = {
  snapshot: irpt.map.isRequired
};
