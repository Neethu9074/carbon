/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import { t } from 'in-i18n';

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
        <Card title={t('in-mobile-apps:beaconUserSum.userInfoTitle')} useMaxAvailableHeight>
          <User beacon={beacon} beacons={beacons} />

          <Dl>
            <Di title={t('in-mobile-apps:beaconUserSum.platformTitle')}>{beacon.platform}</Di>
            <Di title={t('in-mobile-apps:beaconUserSum.bundleTitle')}>{beacon.bundleIdentifier}</Di>
            <Di title={t('in-mobile-apps:beaconUserSum.appTitle')}>
              {[beacon.appBuild, beacon.appVersion].filter(Boolean).join(', ')}
            </Di>
            <Di title={t('in-mobile-apps:beaconUserSum.osTitle')}>
              {[beacon.osName, beacon.osVersion].filter(Boolean).join(' ')}
            </Di>
            <Di title={t('in-mobile-apps:beaconUserSum.deviceTitle')}>
              {[beacon.deviceManufacturer, beacon.deviceModel, beacon.deviceHardware].filter(Boolean).join(', ')}
            </Di>
            <Di title={t('in-mobile-apps:beaconUserSum.viewportResolutionTitle')}>
              {[beacon.viewportWidth, beacon.viewportHeight].filter(Boolean).join('x')}
            </Di>
            <Di title={t('in-mobile-apps:beaconUserSum.preferredLanguagesTitle')}>
              {beacon.userLanguages.filter(Boolean).join(', ')}
            </Di>
            <Di title={t('in-mobile-apps:beaconUserSum.ipTitle')}>{beacon.userIp}</Di>
            <Di title={t('in-mobile-apps:beaconUserSum.carrierTitle')}>{beacon.carrier}</Di>
            {beacon.connectionType && (
              <Di title={t('in-mobile-apps:beaconUserSum.connectionTypeTitle')}>{beacon.connectionType}</Di>
            )}
            {beacon.effectiveConnectionType && (
              <Di title={t('in-mobile-apps:beaconUserSum.effectiveConnectionTypeTitle')}>
                {beacon.effectiveConnectionType}
              </Di>
            )}
          </Dl>
        </Card>
      </Col>
      <Col lg={4}>
        <Card
          title={t('in-mobile-apps:beaconUserSum.userLocationTitle')}
          withoutPadding={!noGeoAvailable}
          useMaxAvailableHeight
        >
          {geoSubsection.length > 0 && (
            <address className={locals.address}>
              <span className={locals.city}>{beacon.city}</span>
              <span className={locals.countryAndContinent}>{geoSubsection.join(', ')}</span>
            </address>
          )}

          {isGeoCoordinatesAvailable && <Map beacon={beacon} />}

          {noGeoAvailable && <NotDefined explanation={t('in-mobile-apps:beaconUserSum.noGeoAvailableExplain')} />}
        </Card>
      </Col>
      <Col lg={4}>
        <Card
          title={t('in-mobile-apps:beaconUserSum.metaTitle')}
          withoutPadding={hasMeta}
          useMaxAvailableHeight
          bodyClassName={locals.metaCard}
        >
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
              explanation={t('in-mobile-apps:beaconUserSum.notDefinedExplain')}
              learnMoreHref="https://instana.com/docs/website_monitoring/api/#metadata"
              learnMoreLabel={t('in-mobile-apps:beaconUserSum.learnMoreLabel')}
            />
          )}
        </Card>
      </Col>
    </Row>
  );
}
