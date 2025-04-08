/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import { DNSTestDetails } from 'in-synthetics/dashboards/details/components/DNSTestDetails';

describe(DNSTestDetails, () => {
  const dummyResultList = {
    progress: { loading: false },
    errors: [],
    data: {
      items: [
        {
          metrics: {
            response_size: [[1716448782519, 57427]],
            start_time: [[1716448782519, 1716448782519]],
            status: [[1716448782519, 0]]
          },
          testResultCommonProperties: {
            clientId: 'saas_instana_test',
            dnsQueryType: 'ANY',
            dnsServerName: '8.8.8.8',
            id: '969eaddc-7703-47ba-ad92-f4f283475808',
            locationDisplayLabel: 'DemoPoP1(Fyre)',
            locationId: 'RtmxRMdmlakWX497YeZN',
            testId: 'CmIJOrkyB2bHTifXyvqe',
            testName: 'dns-demo-test',
            customTags: { Environment: 'Pink', Tag: 'test' },
            ismDetails: {
              CNAME:
                '[{data=tp.47cf2c8c9-frontier.amazon.com, responseTime=29.5426, name=www.amazon.com, type=CNAME, ttl=30}]'
            }
          }
        }
      ],
      page: 1,
      pageSize: 1,
      totalHits: 1
    }
  };

  afterEach(() => {
    cleanup();
  });

  it('Render DNSTestDetails component without any errors', () => {
    render(<DNSTestDetails resultList={dummyResultList} />);
  });

  it('Render DNSTestDetails component with one tab with CNAME label', () => {
    const { container } = render(<DNSTestDetails resultList={dummyResultList} />);
    expect(container.getElementsByTagName('h6')[0].textContent).toBe('Test details');
    expect(container.getElementsByTagName('p')[0].textContent).toBe('DNS result for query type ANY');

    expect(screen.getAllByRole('tab')).toHaveLength(1);
    expect(screen.getByRole('tab').querySelector('.cds--tabs__nav-item-label')).toBeInTheDocument();
    expect(screen.getByRole('tab').querySelector('.cds--tabs__nav-item-label')).toHaveTextContent('CNAME');

    expect(screen.getByTestId('CNAME_tab')).toBeInTheDocument();
  });
});
