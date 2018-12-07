import React from 'react';

import { userAgentParserBrowserNameToIcon } from 'in-websites/browserIcons';
import NotDefined from 'in-websites/analyze/BeaconUserSummary/NotDefined';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import User from 'in-websites/analyze/BeaconUserSummary/User';
import Map from 'in-websites/analyze/BeaconUserSummary/Map';
import { Row, Col } from 'in-new-components/layout/Grid';
import { sortKeys } from 'in-services/util/object';
import Card from 'in-new-components/Card';
import Code from 'in-components/Code';

import locals from './BeaconUserSummary.mless';

export default function BeaconUserSummary({ beacon }) {
  const hasMeta = Object.keys(beacon.meta).length > 0;
  const geoSubsection = [beacon.subdivision, beacon.country, beacon.continent].filter(Boolean);
  const isGeoCoordinatesAvailable = !(beacon.latitude === -1.0 && beacon.longitude === -1.0);
  const noGeoAvailable = !isGeoCoordinatesAvailable && geoSubsection.length === 0;

  return (
    <Row className={locals.summary} verticallyStretchColumns>
      <Col lg={4}>
        <Card title="User Information" useMaxAvailableHeight>
          <User beacon={beacon} />

          <Dl>
            <Di title="Browser" ddClassName={locals.browserItem}>
              {beacon.browserName &&
                userAgentParserBrowserNameToIcon[beacon.browserName.toLowerCase()] && (
                  <img
                    src={userAgentParserBrowserNameToIcon[beacon.browserName.toLowerCase()]}
                    alt={beacon.browserName}
                    className={locals.browserIcon}
                  />
                )}
              {[beacon.browserName, beacon.browserVersion].filter(Boolean).join(' ')}
            </Di>
            <Di title="Operating System">{[beacon.osName, beacon.osVersion].filter(Boolean).join(' ')}</Di>
            <Di title="Screen Resolution">{[beacon.windowWidth, beacon.windowHeight].filter(Boolean).join('x')}</Di>
            <Di title="Preferred Languages">{beacon.userLanguages.filter(Boolean).join(', ')}</Di>
            <Di title="IP Address">{beacon.userIp}</Di>
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

          {noGeoAvailable && <NotDefined explanation="Geo location could not be determined from IP address." />}
        </Card>
      </Col>
      <Col lg={4}>
        <Card title="Meta" withoutPadding={hasMeta} useMaxAvailableHeight bodyClassName={locals.metaCard}>
          {hasMeta && (
            <Code
              showLineNumbers={false}
              code={JSON.stringify(sortKeys(beacon.meta), 0, 2)}
              lang="json"
              wrapperClassName={locals.meta}
            />
          )}
          {!hasMeta && (
            <NotDefined
              explanation="No meta data defined. Meta data can be used to transport information about the deployment or settings. Meta data is available as filter and grouping within the analyze area."
              learnMoreHref="https://docs.instana.io/products/website_monitoring/api/#meta-data"
              learnMoreLabel="Learn how to add meta data"
            />
          )}
        </Card>
      </Col>
    </Row>
  );
}
