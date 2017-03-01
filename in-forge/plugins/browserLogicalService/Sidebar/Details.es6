import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import {msZeroDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import {getTraceViewLinkWithQuery} from 'in-stores/navigation/view';
import Separator from 'in-sdk/components/sidebar/Separator';
import {getTraceCount} from 'in-stores/traces';

export default function BrowserServiceSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  const query = `touching:"${snapshotId}" AND spanType:web AND errors:>0`;
  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
        <CountBasedJumpToButton href$={getTraceViewLinkWithQuery(query)}
                                count$={getTraceCount(query)}
                                title='Uncaught errors'
                                tooltip='View traces for uncaught errors' />
      </TracesButtonWrapper>

      <Separator />

      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'count',
                              label: 'calls/s',
                              formatter: zeroDecimalPlaces
                            }, {
                              metric: 'duration.mean',
                              label: 'load time',
                              formatter: msZeroDecimalPlaces
                            }, {
                              metric: 'fp.mean',
                              label: 'first paint',
                              formatter: msZeroDecimalPlaces
                            }, {
                              metric: 'error_count',
                              label: 'errors/s',
                              formatter: zeroDecimalPlaces
                            }
                          ]} />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
