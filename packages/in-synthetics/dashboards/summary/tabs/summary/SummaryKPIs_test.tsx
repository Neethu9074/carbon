/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cleanup, screen, render } from '@testing-library/react';
import React from 'react';

import { PaginatedResult, Result, TagFilter, TestResultListItem } from '@instana/types';

import SummaryKPIs from 'in-synthetics/dashboards/summary/tabs/summary/SummaryKPIs';

describe(SummaryKPIs, () => {
  afterEach(() => {
    cleanup();
  });

  const dummyResultList = {
    data: {},
    errors: [],
    progress: { loading: true }
  } as unknown as Result<PaginatedResult<TestResultListItem>>;

  it('Render correct set of KPIs for HTTPAction test', () => {
    render(
      <SummaryKPIs
        tagFilters={{} as TagFilter[]}
        isSSLCertificate={false}
        resultList={dummyResultList}
        timeShiftConfig={{ offset: 0 }}
        timeConfig={{ windowSize: 0, autoRefresh: false }}
      />
    );
    expect(screen.getByText('Success Rate')).toBeVisible();
    expect(screen.getByText('Locations')).toBeVisible();
    expect(screen.getByText('Avg. Response Time')).toBeVisible();
    expect(screen.getByText('Avg. Response Size')).toBeVisible();

    expect(screen.queryByText('Last Run - Certificate is Signed by Public CA')).toBeNull();
    expect(screen.queryByText('Last Run - Days Remaining')).toBeNull();
    expect(screen.queryByText('Last Run - Time of Expiry')).toBeNull();
  });

  it('Render correct set of KPIs for HTTPScript test', () => {
    render(
      <SummaryKPIs
        tagFilters={{} as TagFilter[]}
        isSSLCertificate={false}
        resultList={dummyResultList}
        timeShiftConfig={{ offset: 0 }}
        timeConfig={{ windowSize: 0, autoRefresh: false }}
      />
    );
    expect(screen.getByText('Success Rate')).toBeVisible();
    expect(screen.getByText('Locations')).toBeVisible();
    expect(screen.getByText('Avg. Response Time')).toBeVisible();
    expect(screen.getByText('Avg. Response Size')).toBeVisible();

    expect(screen.queryByText('Last Run - Certificate is Signed by Public CA')).toBeNull();
    expect(screen.queryByText('Last Run - Days Remaining')).toBeNull();
    expect(screen.queryByText('Last Run - Time of Expiry')).toBeNull();
  });

  it('Render correct set of KPIs for SSLCertificate test', () => {
    const dummySslResultList = {
      data: {
        items: [
          {
            metrics: {
              'synthetic.customMetrics.daysRemaining': [[1715941282007, 73]],
              'synthetic.customMetrics.valid': [[1716453456055, 1]],
              'synthetic.customMetrics.validFrom': [[1716453456055, 1714608000000]],
              'synthetic.customMetrics.validTo': [[1716453456055, 1746143999000]]
            },
            testResultCommonProperties: {
              clientId: 'saas_instana_test',
              id: 'bfa93a9d-05f5-452d-b52a-05ce1009d62b',
              locationDisplayLabel: 'synctl PoP',
              locationId: 'WP7HsYpQaUmO91jj6py2',
              testId: 'f7xsYJTMB2PSKSqrN5Z3',
              testName: 'ssl check'
            }
          }
        ],
        page: 1,
        pageSize: 1,
        totalHits: 12
      },
      errors: [],
      progress: { loading: true }
    };

    render(
      <SummaryKPIs
        tagFilters={{} as TagFilter[]}
        isSSLCertificate
        resultList={dummySslResultList}
        timeShiftConfig={{ offset: 0 }}
        timeConfig={{ windowSize: 0, autoRefresh: false }}
      />
    );
    expect(screen.getByText('Success Rate')).toBeVisible();
    expect(screen.getByText('Locations')).toBeVisible();
    expect(screen.getByText('Avg. Response Time')).toBeVisible();
    expect(screen.getByText('Last Run - Certificate is Signed by Public CA')).toBeVisible();
    expect(screen.getByText('Last Run - Days Remaining')).toBeVisible();
    expect(screen.getByText('Last Run - Time of Expiry')).toBeVisible();

    expect(screen.queryByText('Avg. Response Size')).toBeNull();
  });
});
