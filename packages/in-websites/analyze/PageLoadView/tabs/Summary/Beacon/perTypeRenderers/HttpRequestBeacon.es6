import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { millis } from 'in-services/formatters/number';

export const LeftHeader = ({ beacon, earliestTimestamp, toggleExpanded }) => {
  let label = beacon.httpCallMethod;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = `${label} ${beacon.httpCallUrl.substring(beacon.httpCallOrigin.length)}`;
  } else {
    label = `${label} ${beacon.httpCallUrl}`;
  }

  return (
    <Fragment>
      <KeyValueHeader label="Request" onClick={toggleExpanded} value={label} />
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
