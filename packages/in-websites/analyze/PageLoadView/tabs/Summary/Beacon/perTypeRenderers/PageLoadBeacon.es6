import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import Timings from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Timings';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { Row, Col } from 'in-new-components/layout/Grid';
import { millis } from 'in-services/formatters/number';

export const getLabel = beacon => beacon.locationUrl;

export const LeftHeader = ({ beacon, toggleExpanded }) => (
  <Fragment>
    <KeyValueHeader label="Page Load Start" onClick={toggleExpanded} value={getLabel(beacon)} />
    <KeyValueHeader label="Page" value={beacon.page} />
    <KeyValueHeader label="onLoad Time" value={millis.fixedCompact(beacon.duration)} />
  </Fragment>
);

export const RightHeader = () => (
  <Fragment>
    <div>TODO</div>
  </Fragment>
);

export const Body = ({ beacon }) => {
  const navigationTimings = [
    {
      label: 'Unload',
      value: beacon.unloadTime
    },
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
    },
    {
      label: 'DOM',
      value: beacon.domTime
    },
    {
      label: 'Children',
      value: beacon.childrenTime
    }
  ];
  const hasNavigationTimings = navigationTimings.reduce((agg, t) => agg || t.value >= 0, false);
  if (hasNavigationTimings) {
    navigationTimings.forEach(t => (t.value = t.value >= 0 ? t.value : 0));
  }

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>Document</BodyHeader>
          <Dl>
            <Di title="URI">
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>Meta</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      <Row>
        {hasNavigationTimings && (
          <Col lg={6}>
            <BodyHeader>Navigation Timing</BodyHeader>
            <Timings timings={navigationTimings} totalDuration={beacon.duration} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
