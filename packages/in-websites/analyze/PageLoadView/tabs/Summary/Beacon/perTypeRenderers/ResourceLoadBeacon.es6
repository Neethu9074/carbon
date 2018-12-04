import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { Row, Col } from 'in-new-components/layout/Grid';
import { millis } from 'in-services/formatters/number';

export const getLabel = beacon => {
  let label = beacon.httpCallUrl;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = beacon.httpCallUrl.substring(beacon.httpCallOrigin.length);
  }
  return label;
};

export const LeftHeader = ({ beacon, earliestTimestamp, toggleExpanded }) => (
  <Fragment>
    <KeyValueHeader label="Page Resource" onClick={toggleExpanded} value={getLabel(beacon)} />
    <KeyValueHeader label="Page" value={beacon.page} />
    <KeyValueHeader label="Start Time" value={`+${millis.fixedCompact(beacon.timestamp - earliestTimestamp)}`} />
    <KeyValueHeader label="Retrieval Time" value={millis.fixedCompact(beacon.duration)} />
  </Fragment>
);

export const RightHeader = () => (
  <Fragment>
    <div>TODO</div>
  </Fragment>
);

export const Body = ({ beacon }) => (
  <Fragment>
    <Row>
      <Col lg={6}>
        <Dl>
          <Di title="URI">{beacon.httpCallUrl}</Di>
          <Di title="Type">{beacon.httpCallUrl}</Di>
        </Dl>
      </Col>
    </Row>
  </Fragment>
);
