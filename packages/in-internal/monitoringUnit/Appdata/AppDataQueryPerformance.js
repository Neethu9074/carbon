/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import CallGroupsChartWrapper from 'in-applications/analyze/components/CallGroupsChartWrapper';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Row, Col } from 'in-new-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  timeConfig: timeConfig$
})(function AppdataWriterStatistics({ timeConfig }) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <Fragment>
      <h1>appdata-reader</h1>

      <Row>
        <Col lg>
          <CallGroupsChartWrapper
            cardTitle={t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.mostActiveUnits')}
            cardHeader={
              <Fragment>
                <Button
                  href$={
                    tagCatalog &&
                    getLinkToAnalyze({
                      dataSource: 'calls',
                      timeConfig,
                      filters: [{ name: 'service.name', operator: 'EQUALS', value: 'clickhouse' }],
                      tagCatalog,
                      groupByTag: { name: 'call.tag', value: 'tenantUnit' },
                      metrics: [
                        {
                          metric: 'latency',
                          aggregation: 'SUM'
                        }
                      ],
                      orderBy: 'latency_SUM_Agg',
                      orderDirection: 'DESC'
                    })
                  }
                >
                  {t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.analyze')}
                </Button>
                &nbsp;
              </Fragment>
            }
            timeConfig={timeConfig}
            tagFilters={[{ name: 'service.name', operator: 'EQUALS', stringValue: 'clickhouse' }]}
            group={{ groupbyTag: 'call.tag', groupbyTagSecondLevelKey: 'tenantUnit' }}
            orderByMetric={0}
            metrics={[
              {
                label: t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.latencySum'),
                metric: 'latency',
                aggregation: 'SUM',
                formatter: millis,
                renderer: Renderer.stackedArea
              },
              {
                label: t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.calls'),
                metric: 'calls',
                aggregation: 'SUM',
                formatter: number,
                renderer: Renderer.stackedArea
              }
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col lg>
          <CallGroupsChartWrapper
            cardTitle={t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.mostCommonQueries')}
            cardHeader={
              <Fragment>
                <Button
                  href$={getLinkToAnalyze({
                    dataSource: 'calls',
                    timeConfig,
                    filters: [
                      { name: 'service.name', operator: 'CONTAINS', value: 'ui-backend' },
                      { name: 'call.tag', operator: 'NOT_EMPTY', value: 'eventClass' },
                      { name: 'call.is_synthetic', value: 'false' }
                    ],
                    groupByTag: { name: 'call.tag', value: 'eventClass' },
                    metrics: [
                      {
                        metric: 'latency',
                        aggregation: 'SUM'
                      }
                    ],
                    orderBy: 'latency_SUM_Agg',
                    orderDirection: 'DESC'
                  })}
                >
                  {t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.analyze')}
                </Button>
                &nbsp;
              </Fragment>
            }
            timeConfig={timeConfig}
            tagFilters={[
              { name: 'service.name', operator: 'CONTAINS', stringValue: 'ui-backend' },
              { name: 'call.tag', operator: 'NOT_EMPTY', stringValue: 'eventClass=' },
              { name: 'call.is_synthetic', booleanValue: 'false' }
            ]}
            group={{ groupbyTag: 'call.tag', groupbyTagSecondLevelKey: 'eventClass' }}
            orderByMetric
            metrics={[
              {
                label: t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.latencySum'),
                metric: 'latency',
                aggregation: 'SUM',
                formatter: millis,
                renderer: Renderer.stackedArea
              },
              {
                label: t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.calls'),
                metric: 'calls',
                aggregation: 'SUM',
                formatter: number,
                renderer: Renderer.stackedArea
              }
            ]}
          />
        </Col>
      </Row>
    </Fragment>
  );
});
