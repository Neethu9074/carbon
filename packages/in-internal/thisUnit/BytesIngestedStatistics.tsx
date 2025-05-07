/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { bytesDetailed } from 'in-stores/metric/formatters';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import { compare } from 'in-services/util/number';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.unit.bytesIngestedStatistics.plugin'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return getPluginName(row.plugin, 1);
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.unit.bytesIngestedStatistics.size'),
    type: 'custom',
    typeArgs: {
      get$(row: any) {
        const { timeConfig, plugin } = row;
        return getUnifiedMetrics({
          metrics: {
            bytesIngested: {
              source: 'INFRASTRUCTURE_METRICS',
              aggregation: 'SUM',
              metric: '__message_size',
              timeShift: { offset: 0 },
              timeConfig,
              resultType: 'SINGLE_NUMBER',
              tagFilterExpression: {
                type: 'EXPRESSION',
                logicalOperator: 'AND',
                elements: []
              },
              type: plugin,
              crossSeriesAggregation: 'SUM',
              regex: false
            }
          }
        }).map(result => {
          const metricResult = result.data?.find(res => res.id === 'bytesIngested')?.values?.[0]?.[1];
          return metricResult ? { value: metricResult, content: bytesDetailed.formatter(metricResult) } : undefined;
        });
      },
      comparator: compare
    }
  }
];

export default function () {
  const timeConfig = useTimeConfig();
  const rows = Object.entries(plugins).map(([key, plugin]) => ({ key, plugin, timeConfig }));

  return (
    <InternalViewWrapper>
      <>
        <DashboardSection title={t('in-internal:monitoringUnit.unit.bytesIngestedStatistics.size')}>
          <UnifiedMetricsChart
            config={{
              type: 'TIME_SERIES',
              y1: {
                metrics: [
                  {
                    metric: '__message_size',
                    aggregation: 'SUM',
                    label: 'message size',
                    source: 'INFRASTRUCTURE_METRICS',
                    crossSeriesAggregation: 'SUM',
                    grouping: [
                      {
                        groupBys: [
                          {
                            groupbyTag: 'type',
                            groupbyTagSecondLevelKey: '',
                            groupbyTagEntity: 'NOT_APPLICABLE'
                          }
                        ],
                        aggregation: 'SUM',
                        direction: 'DESC',
                        maxResults: 500,
                        includeOthers: false,
                        includeUnmatched: true
                      }
                    ],
                    tagFilterExpression: {
                      type: 'EXPRESSION',
                      logicalOperator: 'AND',
                      elements: []
                    }
                  }
                ],
                formatter: 'bytes.detailed',
                renderer: 'stackedArea'
              }
            }}
          />
        </DashboardSection>

        <Table
          cardTitle={t('in-internal:monitoringUnit.unit.bytesIngestedStatistics.size')}
          cols={cols}
          rows={rows}
          getRowDetails={getRowDetails}
          maxItemsPerPage={20}
          initialSortColumn={1}
          initialSortDirection="desc"
          withoutPadding
        />
      </>
    </InternalViewWrapper>
  );
}

function getRowDetails(row: any) {
  return (
    <UnifiedMetricsChart
      config={{
        type: 'TIME_SERIES',
        y1: {
          metrics: [
            {
              metric: '__message_size',
              aggregation: 'SUM',
              label: 'message size',
              source: 'INFRASTRUCTURE_METRICS',
              crossSeriesAggregation: 'SUM',
              tagFilterExpression: {
                type: 'TAG_FILTER',
                name: 'type',
                operator: 'EQUALS',
                entity: 'NOT_APPLICABLE',
                value: row.plugin,
                tagDefinition: {
                  name: 'type',
                  type: 'STRING',
                  path: [{ label: 'Infra' }, { label: 'type' }],
                  availability: []
                }
              }
            }
          ],
          formatter: 'bytes.detailed'
        }
      }}
    />
  );
}
