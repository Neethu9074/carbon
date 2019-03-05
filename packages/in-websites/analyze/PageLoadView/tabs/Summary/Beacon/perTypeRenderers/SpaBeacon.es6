import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { latencyFixed, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';

export const getLabel = () => 'Custom Page Transition';

export const getExtraTooltipFields = beacon => ({
  Duration: latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label="Start Time"
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader label="Duration" value={latencyFixed.compact(beacon.duration)} />
  </Fragment>
);

export const Body = () => <div />;
