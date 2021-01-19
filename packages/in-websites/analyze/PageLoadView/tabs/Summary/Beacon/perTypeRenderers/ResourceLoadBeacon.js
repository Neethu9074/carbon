/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/missingResourceTimings';
import { latencyFixed, bytes, millisToTwoDecimalSeconds, millis } from 'in-services/formatters/number';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendDi';
import LearnMore from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/LearnMore';
import Timings from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Timings';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { explanations } from 'in-websites/cacheInteractionTypes';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';

export const getLabel = beacon => {
  let label = beacon.httpCallUrl;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = beacon.httpCallUrl.substring(beacon.httpCallOrigin.length);
  }
  return label;
};

export const getExtraTooltipFields = beacon => ({
  'Retrieval Time': latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader label="Page Resource" value={getLabel(beacon)} />
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
          <BodyHeader>Asset</BodyHeader>
          <Dl>
            <Di title="Window Location">
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
            <Di title="Resource URI">
              <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
                {beacon.httpCallUrl}
              </a>
            </Di>
            {beacon.backendTime >= 0 && <Di title="Time to First Byte">{millis.fixedCompact(beacon.backendTime)}</Di>}
            <BackendDi beacon={beacon} />
            <Di title="Initiator">{beacon.initiator}</Di>
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>Meta</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      {!hasResourceTimings && !hasNetworkInsights && (
        <Row>
          <Col lg={6}>
            <BodyHeader>Resource Timing</BodyHeader>
            <LearnMore explanation={explanation} href={learnMoreHref} buttonLabel={learnMoreLabel} />
          </Col>
        </Row>
      )}

      <Row>
        {hasResourceTimings && (
          <Col lg={6}>
            <BodyHeader>Resource Timing</BodyHeader>
            <Timings timings={resourceTimings} totalDuration={beacon.duration} totalDurationName="retrieval time" />
          </Col>
        )}

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
    </Fragment>
  );
};
