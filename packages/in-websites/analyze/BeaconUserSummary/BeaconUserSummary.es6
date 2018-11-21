import React from 'react';

import { Dl, Di } from 'in-websites/analyze/BeaconUserSummary/HorizontalDescriptionList';
import User from 'in-websites/analyze/BeaconUserSummary/User';
import Map from 'in-websites/analyze/BeaconUserSummary/Map';
import { Row, Col } from 'in-new-components/layout/Grid';
import getGravatarUrl from 'in-subscription/gravatar';
import Card from 'in-new-components/Card';
import connect from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import locals from './BeaconUserSummary.mless';

export default connect(({ userEmail }) => ({
  gravatar: userEmail && getGravatarUrl(userEmail)
}))(function BeaconUserSummary({ beacon }) {
  const hasMeta = Object.keys(beacon.meta).length > 0;

  const geoSubsection = [beacon.subdivision, beacon.country, beacon.continent].filter(Boolean);
  const isGeoCoordinatesAvailable = !(beacon.latitude === -1.0 && beacon.longitude === -1.0);

  return (
    <Row>
      <Col lg={4}>
        <Card title="User Information">
          <User beacon={beacon} />
          <Dl>
            <Di title="Browser">{[beacon.browserName, beacon.browserVersion].filter(Boolean).join(' ')}</Di>
            <Di title="Operating System">{[beacon.osName, beacon.osVersion].filter(Boolean).join(' ')}</Di>
            <Di title="Screen Resolution">{[beacon.windowWidth, beacon.windowHeight].filter(Boolean).join('x')}</Di>
            <Di title="Preferred Languages">{beacon.userLanguages.filter(Boolean).join(', ')}</Di>
            <Di title="IP Address">{beacon.userIp}</Di>
          </Dl>
        </Card>
      </Col>
      <Col lg={4}>
        <Card title="User Location" withoutPadding>
          <address className={locals.address}>
            <span className={locals.city}>{beacon.city}</span>
            <span className={locals.countryAndContinent}>{geoSubsection.join(', ')}</span>
          </address>

          {isGeoCoordinatesAvailable && <Map beacon={beacon} />}
          {!isGeoCoordinatesAvailable && <p>Location could not be determined from IP.</p>}
        </Card>
      </Col>
      <Col lg={4}>
        <Card title="Meta">
          {hasMeta && (
            <Code
              showLineNumbers={false}
              code={JSON.stringify(ensureSortedMeta(beacon.meta), 0, 2)}
              lang="json"
              className={locals.meta}
            />
          )}
          {!hasMeta && (
            <p>
              No meta data defined.{' '}
              <a href="https://docs.instana.io/products/website_monitoring/api/#meta-data">
                Learn how to configure meta data
              </a>
              .
            </p>
          )}
        </Card>
      </Col>
    </Row>
  );
});

function ensureSortedMeta(meta) {
  return Object.keys(meta)
    .sort()
    .reduce((agg, key) => {
      agg[key] = meta[key];
      return agg;
    }, {});
}
