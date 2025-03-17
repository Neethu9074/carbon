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
        isDNS={false}
        resultList={dummyResultList}
        timeShiftConfig={{ offset: 0 }}
        timeConfig={{ windowSize: 0, autoRefresh: false }}
      />
    );
    expect(screen.getByText('Success rate')).toBeVisible();
    expect(screen.getByText('Locations')).toBeVisible();
    expect(screen.getByText('Avg. response time')).toBeVisible();
    expect(screen.getByText('Avg. response size')).toBeVisible();

    expect(screen.queryByText('Last run - Certificate is signed by public CA')).toBeNull();
    expect(screen.queryByText('Last run - Days remaining')).toBeNull();
    expect(screen.queryByText('Last run - Time of expiry')).toBeNull();
  });

  it('Render correct set of KPIs for HTTPScript test', () => {
    render(
      <SummaryKPIs
        tagFilters={{} as TagFilter[]}
        isSSLCertificate={false}
        isDNS={false}
        resultList={dummyResultList}
        timeShiftConfig={{ offset: 0 }}
        timeConfig={{ windowSize: 0, autoRefresh: false }}
      />
    );
    expect(screen.getByText('Success rate')).toBeVisible();
    expect(screen.getByText('Locations')).toBeVisible();
    expect(screen.getByText('Avg. response time')).toBeVisible();
    expect(screen.getByText('Avg. response size')).toBeVisible();

    expect(screen.queryByText('Last run - Certificate is signed by public CA')).toBeNull();
    expect(screen.queryByText('Last run - Days remaining')).toBeNull();
    expect(screen.queryByText('Last run - Time of expiry')).toBeNull();
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
        isDNS={false}
        resultList={dummySslResultList}
        timeShiftConfig={{ offset: 0 }}
        timeConfig={{ windowSize: 0, autoRefresh: false }}
      />
    );
    expect(screen.getByText('Success rate')).toBeVisible();
    expect(screen.getByText('Locations')).toBeVisible();
    expect(screen.getByText('Avg. response time')).toBeVisible();
    expect(screen.getByText('Last run - Certificate is signed by public CA')).toBeVisible();
    expect(screen.getByText('Last run - Days remaining')).toBeVisible();
    expect(screen.getByText('Last run - Time of expiry')).toBeVisible();

    expect(screen.queryByText('Avg. response size')).toBeNull();
  });

  it('Render correct set of KPIs for DNS test', () => {
    render(
      <SummaryKPIs
        tagFilters={{} as TagFilter[]}
        isSSLCertificate={false}
        isDNS
        resultList={dummyResultList}
        timeShiftConfig={{ offset: 0 }}
        timeConfig={{ windowSize: 0, autoRefresh: false }}
      />
    );
    expect(screen.getByText('Success rate')).toBeVisible();
    expect(screen.getByText('Locations')).toBeVisible();
    expect(screen.getByText('Avg. response time')).toBeVisible();

    expect(screen.queryByText('Avg. response size')).toBeNull();
  });
});
