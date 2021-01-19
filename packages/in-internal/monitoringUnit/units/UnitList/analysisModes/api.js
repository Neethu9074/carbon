/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { unitColumn } from 'in-internal/monitoringUnit/units/UnitList/analysisModes/common';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';

export default {
  name: 'API Usage',
  initialSortColumn: 1,
  initialSortDirection: 'desc',
  cols: [
    unitColumn,
    {
      id: 'API Call Block (Rate Limiting) Rate',
      title: 'API Call Block (Rate Limiting) Rate',
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
            API calls are blocked when they reached the rate limit as defined in the <i>rateLimit</i> config section of{' '}
            <i>ui-backend</i>.
          </p>
          <p>
            The HTTP status code 429 is given in the response, along the following headers (see{' '}
            <a href="https://developer.github.com/v3/#rate-limiting">reference</a>):
            <ul>
              <li>X-RateLimit-Zone</li>
              <li>X-RateLimit-Limit</li>
              <li>X-RateLimit-Remaining</li>
              <li>X-RateLimit-Reset</li>
            </ul>
          </p>
          <p>
            There is a <i>default</i> limit but also more specific ones per <i>zone</i>: <i>search</i>, <i>settings</i>,
            <i>appdata</i>, and <i>snapshots</i>.
          </p>
          <p>
            The below chart only tell you that calls are being blocked but we do not know which of the limits got
            reached. For that you can look at the
            <i>com.instana.ui.resource.api.filter.ratelimit.RateLimitingFilter.distinct-client-key-ZONE</i> metrics in
            <i>ui-backend</i> which give you the call rate per zone, or look closer at traces and more specifically
            status codes and headers.
          </p>
          <p>
            <b>Important:</b> Calls with HTTP status code 429 are not necessarily blocked by the API rate limiters, but
            can also be blocked by one of the limiters used to protect <i>appdata-reader</i> (see corresponding metrics
            in <i>ui-backend</i> with the format <i>appDataReaderXXXLimiter</i>). You can distinguish the 2 cases by
            looking at the presence of the <i>X-RateLimit-XXX</i> headers in the traces.
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
            labels: ['API Call Block (Rate Limiting) Rate'],
            type: 'stackedArea'
          }}
        />
      </>
    );
  }
};
