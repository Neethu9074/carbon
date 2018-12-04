import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import Timings from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Timings';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { explanations } from 'in-websites/cacheInteractionTypes';
import { millis, bytes } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import { Row, Col } from 'in-new-components/layout/Grid';

export const getLabel = beacon => {
  let label = beacon.httpCallMethod;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = `${label} ${beacon.httpCallUrl.substring(beacon.httpCallOrigin.length)}`;
  } else {
    label = `${label} ${beacon.httpCallUrl}`;
  }
  return label;
};

export const LeftHeader = ({ beacon, earliestTimestamp, toggleExpanded }) => (
  <Fragment>
    <KeyValueHeader label="Request" onClick={toggleExpanded} value={getLabel(beacon)} />
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

export const Body = ({ beacon }) => {
  const hasTransferSize = beacon.transferSize >= 0;
  const hasEncodedBodySize = beacon.encodedBodySize >= 0;
  const hasDencodedBodySize = beacon.decodedBodySize >= 0;
  const hasCacheInteraction = !!explanations[beacon.cacheInteraction];
  const hasNetworkInsights = hasTransferSize || hasEncodedBodySize || hasDencodedBodySize || hasCacheInteraction;

  const resourceTimings = [
    {
      label: 'Redirect',
      value: beacon.redirectTime
    },
    {
      label: 'AppCache',
      value: beacon.appCacheTime
    },
    {
      label: 'DNS',
      value: beacon.dnsTime
    },
    {
      label: 'TCP',
      value: beacon.tcpTime
    },
    {
      label: 'SSL',
      value: beacon.sslTime
    },
    {
      label: 'Request',
      value: beacon.requestTime
    },
    {
      label: 'Response',
      value: beacon.responseTime
    }
  ];
  const hasResourceTimings = resourceTimings.reduce((agg, t) => agg || t.value >= 0, false);
  if (hasResourceTimings) {
    resourceTimings.forEach(t => (t.value = t.value >= 0 ? t.value : 0));
  }

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>Call Details</BodyHeader>
          <Dl>
            <Di title="URI">
              <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
                {beacon.httpCallUrl}
              </a>
            </Di>
            <Di title="HTTP Method">{beacon.httpCallMethod}</Di>
            <Di title="HTTP Status">{beacon.httpCallStatus}</Di>
            <Di title="Asynchronous">{yesOrNo(beacon.httpCallAsynchronous)}</Di>
            <Di title="Correlation Attempted">{yesOrNo(beacon.httpCallCorrelationAttempted)}</Di>
          </Dl>
        </Col>
        {hasNetworkInsights && (
          <Col lg={6}>
            <BodyHeader>Network Insights</BodyHeader>
            <Dl>
              <Di title="Cache Interaction">{explanations[beacon.cacheInteraction]}</Di>
              {hasTransferSize && <Di title="Transfer Size">{bytes.detailed(beacon.transferSize)}</Di>}
              {hasEncodedBodySize && <Di title="Encoded Body Size">{bytes.detailed(beacon.encodedBodySize)}</Di>}
              {hasDencodedBodySize && <Di title="Decoded Body Size">{bytes.detailed(beacon.decodedBodySize)}</Di>}
            </Dl>
          </Col>
        )}
      </Row>

      <Row>
        {hasResourceTimings && (
          <Col lg={6}>
            <BodyHeader>Resource Timing</BodyHeader>
            <Timings timings={resourceTimings} totalDuration={beacon.duration} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
