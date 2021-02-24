/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Trans, t } from 'in-i18n';
import React from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';
import Link from 'in-components/Link';

export default {
  name: 'API Usage',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'API Call Block (Rate Limiting) Rate',
      title: t('in-internal:monitoringUnit.units.api.apiCallBlockRateLimitRate'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.id;
        },
        getMetricName() {
          return 'ui-backend.apiRateLimiting';
        },
        getContent: percentage.detailed,
        getTimeWindowAggregation(row) {
          return row.metricAggregation;
        },
        forceTimeWindowAggregation: true
      }
    }
  ],
  getRowDetails({ timeConfig, id }) {
    return (
      <>
        <ChartExplanation>
          <p>
            <Trans
              i18nKey="in-internal:monitoringUnit.units.api.apiChartExplanation_1"
              components={{ italic: <i />, bold: <strong /> }}
            />
          </p>
          <p>
            <Trans
              i18nKey="in-internal:monitoringUnit.units.api.apiChartExplanation_2"
              components={{
                linkToDocs: <Link href="https://developer.github.com/v3/#rate-limiting" external />
              }}
            />
            <ul>
              <li>X-RateLimit-Zone</li>
              <li>X-RateLimit-Limit</li>
              <li>X-RateLimit-Remaining</li>
              <li>X-RateLimit-Reset</li>
            </ul>
          </p>
          <p>
            <Trans
              i18nKey="in-internal:monitoringUnit.units.api.apiChartExplanation_3"
              components={{ italic: <i />, bold: <strong /> }}
            />
          </p>
          <p>
            <Trans
              i18nKey="in-internal:monitoringUnit.units.api.apiChartExplanation_4"
              components={{ italic: <i />, bold: <strong /> }}
            />
          </p>
          <p>
            <Trans
              i18nKey="in-internal:monitoringUnit.units.api.apiChartExplanation_5"
              components={{ italic: <i />, bold: <strong /> }}
            />
          </p>
        </ChartExplanation>
        <Chart
          snapshotId={id}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: [`ui-backend.apiRateLimiting`],
            labels: [t('in-internal:monitoringUnit.units.api.apiCallBlockRateLimitRate')],
            type: 'stackedArea'
          }}
        />
      </>
    );
  }
};
