import React from 'react';

import {msZeroDecimalPlaces, zeroDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import JumpToTracesOfServiceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceButton';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function BrowserServiceSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <JumpToTracesOfServiceButton snapshotId={snapshotId} />

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
                              metric: 'error_rate',
                              label: 'errors/s',
                              formatter: percentageZeroDecimalPlaces
                            }
                          ]} />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
