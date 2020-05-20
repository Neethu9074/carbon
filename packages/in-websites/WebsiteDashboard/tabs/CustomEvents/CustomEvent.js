import React from 'react';

import { getLinkToWebsite, getLinkToAnalyze, customEventsTabFullyQualified } from 'in-websites/navigation/paths';
import WebsiteMetricsKpiCard from 'in-websites/WebsiteDashboard/components/WebsiteMetricsKpiCard';
import WebsiteChartWrapper from 'in-websites/WebsiteDashboard/components/WebsiteChartWrapper';
import { customEventId as customEventIdMatrixParameter } from 'in-websites/navigation/matrix';
import BrowserTopList from 'in-websites/WebsiteDashboard/tabs/CustomEvents/BrowserTopList';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import PageTopList from 'in-websites/WebsiteDashboard/tabs/CustomEvents/PageTopList';
import OsTopList from 'in-websites/WebsiteDashboard/tabs/CustomEvents/OsTopList';
import { affectedUsers, affectedUsersChart } from 'in-websites/formatters';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { millis, number } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { getChartGranularity } from 'in-websites/metrics';
import { Col, Row } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard/KpiCard';
import BackButton from 'in-new-components/BackButton';
import Button from 'in-new-components/Button';
import Footer from 'in-new-components/Footer';
import Title from 'in-components/Title';

import locals from './CustomEvent.mless';

export default function CustomEvent({ location, tagFilters, timeConfig, websiteId, pageId, websiteLabel }) {
  const customEventId = getMatrixParameter(location, '/details', customEventIdMatrixParameter);
  if (!customEventId) {
    return <RedirectWithHash to={customEventsTabFullyQualified} />;
  }

  const granularity = getChartGranularity(timeConfig);
  tagFilters = tagFilters.concat([{ name: 'beacon.customEvent.name', stringValue: customEventId, operator: 'EQUALS' }]);

  return (
    <>
      <Title title="Custom Event Details" dynamic={customEventId} />

      <div className={locals.actions}>
        <BackButton
          label="Back to list of custom events"
          href$={getLinkToWebsite(websiteId, { tabPath: '/customEvents', pageId })}
          withoutMargin
        />

        <Button
          kind="secondary"
          href$={getLinkToAnalyze({
            beaconType: 'custom',
            tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
              websiteLabel,
              tagFilters
            }),
            group: {
              groupbyTag: 'beacon.location.path'
            }
          })}
        >
          Analyze Custom Event
        </Button>
      </div>

      <Row>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title="Occurrences"
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                occurrences: {
                  metric: 'beaconCount',
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
        <Col lg={3}>
          <WebsiteMetricsKpiCard
            title="Users"
            formatter={affectedUsers.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                uniqueUsersOrSessions: {
                  metric: 'uniqueUsersOrSessions',
                  aggregation: 'DISTINCT_COUNT'
                }
              }
            }}
          />
        </Col>
        <Col xs={6}>
          <KpiCard title="Custom Event" value={customEventId} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="Occurrences"
            timeConfig={timeConfig}
            renderLegend={false}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.bar,
              formatter: number.forcedCompact,
              labels: ['Occurrences'],
              metricIds: ['beaconCount']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                beaconCount: {
                  metric: 'beaconCount',
                  granularity,
                  aggregation: 'SUM',
                  omitMetricInAnalytics: true,
                  beaconType: 'custom'
                }
              }
            }}
          />
        </Col>
        <Col lg={6}>
          <WebsiteChartWrapper
            cardTitle="Users"
            timeConfig={timeConfig}
            renderLegend={false}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.bar,
              formatter: affectedUsersChart,
              labels: ['Users'],
              metricIds: ['uniqueUsersOrSessions']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                uniqueUsersOrSessions: {
                  metric: 'uniqueUsersOrSessions',
                  granularity,
                  aggregation: 'DISTINCT_COUNT',
                  beaconType: 'custom'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <WebsiteChartWrapper
            cardTitle="Duration"
            reverseTooltipOrder
            shareMaxAxisDomain
            timeConfig={timeConfig}
            viewInAnalytics={{
              websiteLabel
            }}
            y1={{
              renderer: Renderer.integral,
              calculateStackDifferences: true,
              formatter: millis.forcedFixedCompact,
              labels: ['50th', '90th', '95th', '99th', 'Max'],
              defaultDisabledMetrics: ['durationMax'],
              metricIds: ['duration50th', 'duration90th', 'duration95th', 'duration99th', 'durationMax']
            }}
            y2={{
              renderer: Renderer.line,
              formatter: millis.forcedFixedCompact,
              labels: ['Mean'],
              defaultDisabledMetrics: ['durationMean'],
              metricIds: ['durationMean']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                duration50th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P50',
                  beaconType: 'custom'
                },
                duration90th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P90',
                  beaconType: 'custom'
                },
                duration95th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P95',
                  beaconType: 'custom'
                },
                duration99th: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'P99',
                  beaconType: 'custom'
                },
                durationMax: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'MAX',
                  beaconType: 'custom'
                },
                durationMean: {
                  metric: 'beaconDuration',
                  granularity,
                  aggregation: 'MEAN',
                  beaconType: 'custom'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        {pageId == null && (
          <Col lg={4}>
            <PageTopList
              websiteId={websiteId}
              websiteLabel={websiteLabel}
              tagFilters={tagFilters}
              timeConfig={timeConfig}
            />
          </Col>
        )}
        <Col lg={pageId == null ? 4 : 6}>
          <BrowserTopList
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            pageId={pageId}
          />
        </Col>
        <Col lg={pageId == null ? 4 : 6}>
          <OsTopList
            websiteId={websiteId}
            websiteLabel={websiteLabel}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            pageId={pageId}
          />
        </Col>
      </Row>
      <Footer />
    </>
  );
}
