import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/paths/tracePaths';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';
import { number, ms } from 'in-services/formatters/number';
import { getTraceCount } from 'in-stores/traces';

export default function BrowserServiceSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  const query = `trace.touching:"${snapshotId}" AND trace.type:web AND trace.errorCount:>0`;

  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
        <CountBasedJumpToButton
          href$={getTraceViewLinkWithQuery(query)}
          count$={getTraceCount(query)}
          title="Errors"
          tooltip="View traces for errors"
        />
      </TracesButtonWrapper>

      <Separator />

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'count',
            label: 'views',
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'duration.mean',
            label: 'load time',
            formatter: ms,
            aggregation: 'mean'
          },
          {
            metric: 'fp',
            label: 'first paint',
            formatter: ms,
            aggregation: 'mean'
          },
          {
            metric: 'error_count',
            label: 'errors',
            formatter: number,
            aggregation: 'mean'
          }
        ]}
      />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
