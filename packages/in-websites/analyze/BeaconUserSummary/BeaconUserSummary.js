/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import NotDefined from 'in-websites/analyze/BeaconUserSummary/NotDefined';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { expandNestedSerializedJson } from 'in-services/util/json';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import User from 'in-websites/analyze/BeaconUserSummary/User';
import Map from 'in-websites/analyze/BeaconUserSummary/Map';
import { Row, Col } from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './BeaconUserSummary.mless';

export default function BeaconUserSummary({ beacon, beacons, withoutSideMargin }) {
  const hasMeta = Object.keys(beacon.meta).length > 0;
  const geoSubsection = [beacon.subdivision, beacon.country, beacon.continent].filter(Boolean);
  const isGeoCoordinatesAvailable = !(beacon.latitude === -1.0 && beacon.longitude === -1.0);
  const noGeoAvailable = !isGeoCoordinatesAvailable && geoSubsection.length === 0;

  return (
    <Row className={locals.summary} verticallyStretchColumns withoutSideMargin={withoutSideMargin}>
      <Col lg={4}>
        <Card title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleUserInformation')} useMaxAvailableHeight>
          <User beacon={beacon} beacons={beacons} />

          <Dl>
            <Di title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleBrowser')}>
              {[beacon.browserName, beacon.browserVersion].filter(Boolean).join(' ')}
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleOperatingSystem')}>
              {[beacon.osName, beacon.osVersion].filter(Boolean).join(' ')}
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleWindowDimensions')}>
              {[beacon.windowWidth, beacon.windowHeight].filter(Boolean).join('x')}
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.beaconUserSummary.titlePreferredLanguages')}>
              {beacon.userLanguages.filter(Boolean).join(', ')}
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleIPAddress')}>{beacon.userIp}</Di>
            {beacon.connectionType && (
              <Di title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleEffectiveConnectionType')}>
                {beacon.connectionType}
              </Di>
            )}
            {beacon.sessionId && (
              <Di title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleSessionID')}>
                <Link
                  title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleSeeAllPageLoadsHavingThisSessionID')}
                  href$={getLinkToAnalyze({
                    groupBy: {},
                    formModel: [tagFilter('beacon.sessionId', 'EQUALS', beacon.sessionId)],
                    beaconType: 'pageLoad'
                  })}
                >
                  {beacon.sessionId}
                </Link>
              </Di>
            )}
          </Dl>
        </Card>
      </Col>
      <Col lg={4}>
        <Card
          title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleUserLocation')}
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

          {noGeoAvailable && (
            <NotDefined
              explanation={t(
                'in-websites:analyze.analyzeView.beaconUserSummary.explanationGeolocationCouldNotBeDeterminedFromIPAddress'
              )}
            />
          )}
        </Card>
      </Col>
      <Col lg={4}>
        <Card
          title={t('in-websites:analyze.analyzeView.beaconUserSummary.titleMeta')}
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
              explanation={t('in-websites:analyze.analyzeView.beaconUserSummary.explanationNoMetaDataDefined')}
              learnMoreHref="https://instana.com/docs/website_monitoring/api/#metadata"
              learnMoreLabel={t('in-websites:analyze.analyzeView.beaconUserSummary.labelLearnHowToAddMetaData')}
            />
          )}
        </Card>
      </Col>
    </Row>
  );
}
