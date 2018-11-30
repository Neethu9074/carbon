import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { millis } from 'in-services/formatters/number';

export const LeftHeader = ({ beacon, earliestTimestamp, toggleExpanded }) => {
  let label = beacon.httpCallUrl;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = beacon.httpCallUrl.substring(beacon.httpCallOrigin.length);
  }

  return (
    <Fragment>
      <KeyValueHeader label="Page Resource" onClick={toggleExpanded} value={label} />
      <KeyValueHeader label="Page" value={beacon.page} />
      <KeyValueHeader label="Start Time" value={`+${millis.fixedCompact(beacon.timestamp - earliestTimestamp)}`} />
      <KeyValueHeader label="Retrieval Time" value={millis.fixedCompact(beacon.duration)} />
    </Fragment>
  );
};

export const RightHeader = () => (
  <Fragment>
    <div>TODO</div>
  </Fragment>
);

export const Body = () => <div>TODO</div>;
