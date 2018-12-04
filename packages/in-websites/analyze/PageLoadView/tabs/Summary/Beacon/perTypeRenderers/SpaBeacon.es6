import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { millis } from 'in-services/formatters/number';

export const getLabel = () => 'Custom Page Transition';

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader label="Page" value={beacon.page} />
    <KeyValueHeader label="Start Time" value={`+${millis.fixedCompact(beacon.timestamp - earliestTimestamp)}`} />
    <KeyValueHeader label="Duration" value={millis.fixedCompact(beacon.duration)} />
  </Fragment>
);

export const RightHeader = () => (
  <Fragment>
    <div>TODO</div>
  </Fragment>
);

export const Body = () => <div>TODO</div>;
