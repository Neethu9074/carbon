/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import HttpRequestOriginTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/HttpRequestOriginTopList';
import MobileAppMetricsKpiCard from 'in-mobile-apps/MobileAppDashboard/components/MobileAppMetricsKpiCard';
import MobileAppChartWrapper from 'in-mobile-apps/MobileAppDashboard/components/MobileAppChartWrapper';
import MobileAppGeoHeatMap from 'in-mobile-apps/MobileAppDashboard/components/MobileAppGeoHeatMap';
import ViewsTopList from 'in-mobile-apps/MobileAppDashboard/tabs/Summary/ViewsTopList';
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import { getLinkToAnalyze, summaryTab } from 'in-mobile-apps/navigation/paths';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import Card from 'in-new-components/Card';

export default function Summary({ tagFilters, timeConfig, mobileAppId, mobileAppLabel, viewId }) {
  const granularity = getChartGranularity(timeConfig);
  const tagCatalogSessionStart = useTagCatalog('sessionStart');
  const tagCatalogViewChange = useTagCatalog('viewChange');

  return (
    <Fragment>
      <Row>
        <Col xs>
          <MobileAppMetricsKpiCard
            title={t('in-mobile-apps:dashboard.tabs.sessionStartsTitle')}
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                sessions: {
                  metric: 'sessions',
                  aggregation: 'SUM'
                }
              }
            }}
            iconAction={{
              text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogSessionStart &&
                getLinkToAnalyze({
                  beaconType: 'sessionStart',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    mobileAppLabel,
                    tagFilters,
                    tagCatalog: tagCatalogSessionStart
                  }),
                  groupBy: {
                    groupbyTag: 'mobileBeacon.view.name'
                  }
                })
            }}
          />
        </Col>
        <Col xs>
          <MobileAppMetricsKpiCard
            title={t('in-mobile-apps:dashboard.tabs.viewTransitionsTitle')}
            formatter={number.compact}
            metricsConfig={{
              tagFilters,
              timeConfig,
              metrics: {
                sessions: {
                  metric: 'views',
                  aggregation: 'SUM'
                }
              }
            }}
            iconAction={{
              text: t('in-mobile-apps:dashboard.tabs.viewInAnalyzeIconAction'),
              kind: 'subtle',
              icon: 'lib_analyze',
              href$:
                tagCatalogViewChange &&
                getLinkToAnalyze({
                  beaconType: 'viewChange',
                  formModel: translateDemocratisationTagFiltersToFormModel({
                    mobileAppLabel,
                    tagFilters,
                    tagCatalog: tagCatalogViewChange
                  }),
                  groupBy: {
                    groupbyTag: 'mobileBeacon.view.name'
                  }
                })
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <MobileAppChartWrapper
            cardTitle={t('in-mobile-apps:dashboard.tabs.activityCardTitle')}
            timeConfig={timeConfig}
            viewInAnalytics={{
              mobileAppLabel
            }}
            y1={{
              renderer: Renderer.stackedBar,
              formatter: number.forcedCompact,
              labels: [
                t('in-mobile-apps:dashboard.tabs.sessionStartsLabel'),
                t('in-mobile-apps:dashboard.tabs.viewTransitionsLabel')
              ],
              metricIds: ['sessions', 'views']
            }}
            metricsConfiguration={{
              timeConfig,
              tagFilters,
              metrics: {
                sessions: {
                  metric: 'sessions',
                  granularity,
                  aggregation: 'SUM',
                  beaconType: 'sessionStart',
                  omitMetricInAnalytics: true
                },
                views: {
                  metric: 'views',
                  granularity,
                  aggregation: 'SUM'
                }
              }
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={viewId == null ? 4 : 6}>
          <Card title={t('in-mobile-apps:dashboard.tabs.geographyTitle')} withoutPadding>
            <MobileAppGeoHeatMap canDrillDown tagFilters={tagFilters} timeConfig={timeConfig} height={300} />
          </Card>
        </Col>
        <Col lg={viewId == null ? 4 : 6}>
          <HttpRequestOriginTopList
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            mobileAppId={mobileAppId}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'originsTab' }}
          />
        </Col>
        {viewId == null && (
          <Col lg={4}>
            <ViewsTopList tagFilters={tagFilters} timeConfig={timeConfig} mobileAppId={mobileAppId} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
