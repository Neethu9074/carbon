import React, { Fragment } from 'react';

import EffectiveConnectionTypeTopList from 'in-websites/WebsiteDashboard/tabs/User/EffectiveConnectionTypeTopList';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import BrowserTopList from 'in-websites/WebsiteDashboard/tabs/User/BrowserTopList';
import OsTopList from 'in-websites/WebsiteDashboard/tabs/User/OsTopList';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';

export default function User({ timeConfig, tagFilters, websiteId, websiteLabel }) {
  const granularity = getChartGranularity(timeConfig);

  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <WebsiteChartWrapper
            cardTitle="Activity"
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: ['Page Loads', 'Page Transitions'],
              metricIds: ['pageLoads', 'pageTransitions']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: number.forcedCompact,
              labels: ['Users'],
              metricIds: ['uniqueUsers']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                pageLoads: {
                  metric: 'pageLoads',
                  granularity,
                  aggregation: 'SUM'
                },
                pageTransitions: {
                  metric: 'pageTransitions',
                  granularity,
                  aggregation: 'SUM'
                },
                uniqueUsers: {
                  metric: 'uniqueUsers',
                  granularity,
                  aggregation: 'DISTINCT_COUNT'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          <BrowserTopList
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            websiteId={websiteId}
            websiteLabel={websiteLabel}
          />
        </Col>
        <Col lg={4}>
          <OsTopList
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            websiteId={websiteId}
            websiteLabel={websiteLabel}
          />
        </Col>
        <Col lg={4}>
          <EffectiveConnectionTypeTopList
            timeConfig={timeConfig}
            tagFilters={tagFilters}
            websiteId={websiteId}
            websiteLabel={websiteLabel}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
