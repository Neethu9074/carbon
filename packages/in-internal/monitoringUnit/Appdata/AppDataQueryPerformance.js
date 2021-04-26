/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import CallGroupsChartWrapper from 'in-applications/analyze/components/CallGroupsChartWrapper';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { CONTAINS, NOT_EMPTY } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { createMetricField, createOrderBy } from 'in-analyze/navigation/paths';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { number, millis } from 'in-services/formatters/number';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Row, Col } from 'in-new-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo({
  timeConfig: timeConfig$
})(function AppdataWriterStatistics({ timeConfig }) {
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
                  href$={getLinkToAnalyze({
                    dataSource: 'calls',
                    timeConfig,
                    formModel: [tagFilter('service.name', CONTAINS, 'clickhouse')],
                    groupBy: { groupbyTag: 'call.tag', groupbyTagSecondLevelKey: 'tenantUnit' },
                    fields: [createMetricField('latency', 'SUM')],
                    orderByGroups: createOrderBy('latency_SUM', 'DESC')
                  })}
                >
                  {t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.analyze')}
                </Button>
                &nbsp;
              </Fragment>
            }
            timeConfig={timeConfig}
            tagFilters={[{ name: 'service.name', operator: CONTAINS, stringValue: 'clickhouse' }]}
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
                    formModel: joinExpressions({
                      expressions: [
                        tagFilter('service.name', CONTAINS, 'ui-backend'),
                        tagFilter('call.tag', NOT_EMPTY, undefined, 'eventClass')
                      ]
                    }),
                    groupBy: { groupbyTag: 'call.tag', groupbyTagSecondLevelKey: 'eventClass' },
                    fields: [createMetricField('latency', 'SUM')],
                    orderByGroups: createOrderBy('latency_SUM', 'DESC')
                  })}
                >
                  {t('in-internal:monitoringUnit.appdata.appDataQueryPerformance.analyze')}
                </Button>
                &nbsp;
              </Fragment>
            }
            timeConfig={timeConfig}
            tagFilters={[
              { name: 'service.name', operator: CONTAINS, stringValue: 'ui-backend' },
              { name: 'call.tag', operator: NOT_EMPTY, stringValue: 'eventClass' }
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
