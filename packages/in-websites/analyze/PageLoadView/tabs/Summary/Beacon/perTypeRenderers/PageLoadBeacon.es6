import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { millis } from 'in-services/formatters/number';

export const LeftHeader = ({ beacon, toggleExpanded }) => (
  <Fragment>
    <KeyValueHeader label="Page Load Start" onClick={toggleExpanded} value={beacon.locationUrl} />
    <KeyValueHeader label="Page" value={beacon.page} />
    <KeyValueHeader label="onLoad Time" value={millis.fixedCompact(beacon.duration)} />
  </Fragment>
);

export const RightHeader = () => (
  <Fragment>
    <div>TODO</div>
  </Fragment>
);

export const Body = () => <div>TODO</div>;
