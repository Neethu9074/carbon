import React from 'react';

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

  return (
    <Row>
      <Col lg={4}>
        <Card title="User Information">lorem</Card>
      </Col>
      <Col lg={4}>
        <Card title="User Location" withoutPadding>
          <address className={locals.address}>
            <span className={locals.city}>{beacon.city}</span>
            <span className={locals.countryAndContinent}>{geoSubsection.join(', ')}</span>
          </address>
          <Map beacon={beacon} />
        </Card>
      </Col>
      <Col lg={4}>
        <Card title="Meta">
          {hasMeta && (
            <Code
              showLineNumbers={false}
              code={JSON.stringify(beacon.meta, 0, 2)}
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
