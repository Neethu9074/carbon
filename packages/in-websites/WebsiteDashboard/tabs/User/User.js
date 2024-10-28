/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { chartColors } from 'in-themes/chartColors';
import Tooltip from 'in-components/Tooltip';
import { Link } from '@instana/components';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function User({ timeConfig, tagFilters, websiteLabel }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <WebsiteChartWrapper
            customHeight={100}
            height={100}
            title={t('in-websites:websiteDashboard.tabs.user.usersCardTitleActivity')}
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
              colors: [chartColors.threeColorPalette[1], chartColors.threeColorPalette[2]],
              metricIds: ['pageLoads', 'pageTransitions']
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
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Tooltip content="tooltip content">
            <Link href="http://instana.io">static link</Link>
          </Tooltip>
        </Col>
      </Row>

      <Footer />
    </Fragment>
  );
}
