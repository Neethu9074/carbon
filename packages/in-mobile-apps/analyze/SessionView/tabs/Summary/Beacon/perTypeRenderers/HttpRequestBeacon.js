/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import BatchIndicator from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BackendDi';
import { latencyFixed, bytes, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import Meta from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';

export const getLabel = beacon => {
  let label = beacon.httpCallMethod;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = `${label} ${beacon.httpCallUrl.substring(beacon.httpCallOrigin.length)}`;
  } else {
    label = `${label} ${beacon.httpCallUrl}`;
  }
  return label;
};

export const getExtraTooltipFields = beacon => ({
  'Retrieval Time': latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          Request
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label="Start Time"
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader label="Retrieval Time" value={latencyFixed.compact(beacon.duration)} />
  </Fragment>
);

export const Body = ({ beacon }) => {
  const hasTransferSize = beacon.transferSize >= 0;
  const hasEncodedBodySize = beacon.encodedBodySize >= 0;
  const hasDencodedBodySize = beacon.decodedBodySize >= 0;

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>Call Details</BodyHeader>
          <Dl>
            <Di title="HTTP Call URI">
              <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
                {beacon.httpCallUrl}
              </a>
            </Di>
            <BackendDi beacon={beacon} />
            <Di title="HTTP Method">{beacon.httpCallMethod}</Di>
            <Di title="HTTP Status">{beacon.httpCallStatus}</Di>
            {isNotBlank(beacon.errorMessage) && <Di title="Error Message">{beacon.errorMessage}</Di>}
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>Meta</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      {hasTransferSize ||
        hasEncodedBodySize ||
        (hasDencodedBodySize && (
          <Row>
            <Col lg={6}>
              <BodyHeader>Network Insights</BodyHeader>
              <Dl>
                {hasTransferSize && <Di title="Transfer Size">{bytes.detailed(beacon.transferSize)}</Di>}
                {hasEncodedBodySize && <Di title="Encoded Body Size">{bytes.detailed(beacon.encodedBodySize)}</Di>}
                {hasDencodedBodySize && <Di title="Decoded Body Size">{bytes.detailed(beacon.decodedBodySize)}</Di>}
              </Dl>
            </Col>
          </Row>
        ))}
    </Fragment>
  );
};
