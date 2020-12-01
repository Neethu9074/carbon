import React from 'react';

import NotDefined from 'in-websites/analyze/BeaconUserSummary/NotDefined';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { expandNestedSerializedJson } from 'in-services/util/json';
import User from 'in-mobile-apps/analyze/BeaconUserSummary/User';
import Map from 'in-websites/analyze/BeaconUserSummary/Map';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import Code from 'in-components/Code';

import locals from './BeaconUserSummary.mless';

export default function BeaconUserSummary({ beacon, beacons }) {
  const hasMeta = Object.keys(beacon.meta).length > 0;
  const geoSubsection = [beacon.subdivision, beacon.country, beacon.continent].filter(Boolean);
  const isGeoCoordinatesAvailable = !(beacon.latitude === -1.0 && beacon.longitude === -1.0);
  const noGeoAvailable = !isGeoCoordinatesAvailable && geoSubsection.length === 0;

  return (
    <Row className={locals.summary} verticallyStretchColumns>
      <Col lg={4}>
        <Card title="User Information" useMaxAvailableHeight>
          <User beacon={beacon} beacons={beacons} />

          <Dl>
            <Di title="Platform">{beacon.platform}</Di>
            <Di title="Bundle">{beacon.bundleIdentifier}</Di>
            <Di title="App">{[beacon.appBuild, beacon.appVersion].filter(Boolean).join(', ')}</Di>
            <Di title="Operating System">{[beacon.osName, beacon.osVersion].filter(Boolean).join(' ')}</Di>
            <Di title="Device">
              {[beacon.deviceManufacturer, beacon.deviceModel, beacon.deviceHardware].filter(Boolean).join(', ')}
            </Di>
            <Di title="Viewport Resolution">
              {[beacon.viewportWidth, beacon.viewportHeight].filter(Boolean).join('x')}
            </Di>
            <Di title="Preferred Languages">{beacon.userLanguages.filter(Boolean).join(', ')}</Di>
            <Di title="IP Address">{beacon.userIp}</Di>
            <Di title="Carrier">{beacon.carrier}</Di>
            {beacon.connectionType && <Di title="Connection Type">{beacon.connectionType}</Di>}
            {beacon.effectiveConnectionType && (
              <Di title="Effective Connection Type">{beacon.effectiveConnectionType}</Di>
            )}
          </Dl>
        </Card>
      </Col>
      <Col lg={4}>
        <Card title="User Location" withoutPadding={!noGeoAvailable} useMaxAvailableHeight>
          {geoSubsection.length > 0 && (
            <address className={locals.address}>
              <span className={locals.city}>{beacon.city}</span>
              <span className={locals.countryAndContinent}>{geoSubsection.join(', ')}</span>
            </address>
          )}

          {isGeoCoordinatesAvailable && <Map beacon={beacon} />}

          {noGeoAvailable && <NotDefined explanation="Geolocation could not be determined from IP address." />}
        </Card>
      </Col>
      <Col lg={4}>
        <Card title="Meta" withoutPadding={hasMeta} useMaxAvailableHeight bodyClassName={locals.metaCard}>
          {hasMeta && (
            <Code
              showLineNumbers={false}
              code={JSON.stringify(expandNestedSerializedJson(beacon.meta), 0, 2)}
              lang="json"
              wrapperClassName={locals.meta}
            />
          )}
          {!hasMeta && (
            <NotDefined
              explanation="No meta data defined. Meta data can be used to transport information about the deployment or settings. Meta data is available as filter and grouping within the analyze area."
              learnMoreHref="https://instana.com/docs/website_monitoring/api/#metadata"
              learnMoreLabel="Learn how to add meta data"
            />
          )}
        </Card>
      </Col>
    </Row>
  );
}
