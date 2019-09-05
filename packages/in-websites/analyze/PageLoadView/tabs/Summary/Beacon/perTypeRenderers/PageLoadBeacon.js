import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendDi';
import Timings from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Timings';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { millis, latencyFixed } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';

export const getLabel = beacon => beacon.locationUrl;

export const hideStartTimeTooltipField = true;

export const getExtraTooltipFields = beacon => ({
  'onLoad Time': latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon }) => (
  <Fragment>
    <KeyValueHeader label="Page Load" value={getLabel(beacon)} />
    <KeyValueHeader label="onLoad Time" value={latencyFixed.compact(beacon.duration)} />
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
            <Di title="Window Location">
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
            <BackendDi beacon={beacon} />
            {beacon.firstPaintTime > -1 && (
              <Di title="First Paint Time">{millis.fixedCompact(beacon.firstPaintTime)}</Di>
            )}
            {beacon.firstContentfulPaintTime > -1 && (
              <Di title="First-Contentful Paint Time">{millis.fixedCompact(beacon.firstContentfulPaintTime)}</Di>
            )}
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
            <Timings timings={navigationTimings} totalDuration={beacon.duration} totalDurationName="onLoad time" />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
