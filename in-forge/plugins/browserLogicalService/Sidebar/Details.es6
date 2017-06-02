import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import { number, ms } from 'in-services/formatters/number';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import Separator from 'in-sdk/components/sidebar/Separator';
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
          title="Uncaught errors"
          tooltip="View traces for uncaught errors"
        />
      </TracesButtonWrapper>

      <Separator />

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'count',
            label: 'calls/s',
            formatter: number
          },
          {
            metric: 'duration.mean',
            label: 'load time',
            formatter: ms
          },
          {
            metric: 'fp',
            label: 'first paint',
            formatter: ms
          },
          {
            metric: 'error_count',
            label: 'errors/s',
            formatter: number
          }
        ]}
      />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
