/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import EffectiveConnectionTypeTopList from 'in-websites/WebsiteDashboard/tabs/User/EffectiveConnectionTypeTopList';
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import WindowWidthBreakdown from 'in-websites/WebsiteDashboard/tabs/User/WindowWidthBreakdown';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import BrowserTopList from 'in-websites/WebsiteDashboard/tabs/User/BrowserTopList';
import OsTopList from 'in-websites/WebsiteDashboard/tabs/User/OsTopList';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Row, Col } from 'in-new-components/layout/Grid';
import { usersTab } from 'in-websites/navigation/paths';
import { number } from 'in-services/formatters/number';
import Footer from 'in-new-components/Footer';
import { t } from 'in-i18n';

export default function User({ timeConfig, tagFilters, websiteId, websiteLabel }) {
  const granularity = getChartGranularity(timeConfig);

  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId });

  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <WebsiteChartWrapper
            cardTitle={t('in-websites:websiteDashboard.tabs.user.usersCardTitleActivity')}
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: [
                t('in-websites:websiteDashboard.tabs.user.usersLabelPageLoads'),
                t('in-websites:websiteDashboard.tabs.user.usersLabelPageTransitions')
              ],
              metricIds: ['pageLoads', 'pageTransitions']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: number.forcedCompact,
              labels: [t('in-websites:websiteDashboard.tabs.user.usersLabelUsers')],
              metricIds: ['uniqueUsersOrSessions']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                pageLoads: {
                  metric: 'pageLoads',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'pageLoad'
                },
                pageTransitions: {
                  metric: 'pageTransitions',
                  granularity,
                  aggregation: 'SUM'
                },
                uniqueUsersOrSessions: {
                  metric: 'uniqueUsersOrSessions',
                  granularity,
                  aggregation: 'DISTINCT_COUNT',
                  beaconType: 'pageLoad'
                }
              }
            }}
            renderPostChartContent={MarkerLanes}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <BrowserTopList
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            urlMatrixParamConfig={{ path: usersTab, paramTab: 'browserTab' }}
          />
        </Col>
        <Col lg={6}>
          <WindowWidthBreakdown
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            urlMatrixParamConfig={{ path: usersTab, paramTab: 'wwTab' }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <OsTopList
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            urlMatrixParamConfig={{ path: usersTab, paramTab: 'osTab' }}
          />
        </Col>
        <Col lg={6}>
          <EffectiveConnectionTypeTopList
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            urlMatrixParamConfig={{ path: usersTab, paramTab: 'connTab' }}
          />
        </Col>
      </Row>
      <Footer />
    </Fragment>
  );
}
