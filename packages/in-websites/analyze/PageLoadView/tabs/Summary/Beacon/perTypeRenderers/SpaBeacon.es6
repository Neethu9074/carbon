import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';

export const getLabel = () => 'Custom Page Transition';

export const getExtraTooltipFields = beacon => ({
  Duration: millis.fixedCompact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label="Start Time"
      value={`+${millis.compact(beacon.timestamp - earliestTimestamp)}`}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader label="Duration" value={millis.fixedCompact(beacon.duration)} />
  </Fragment>
);

export const Body = () => <div />;
