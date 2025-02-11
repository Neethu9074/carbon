/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { cleanup, render } from '@testing-library/react';
import React from 'react';

import { CustomPropertiesSection } from 'in-synthetics/dashboards/details/components/CustomPropertiesSection';

describe(CustomPropertiesSection, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render correct set of Custom Properties for HTTPAction test (display both custom metrics and custom tags)', () => {
    const testType = 'HTTPAction';
    const dummyResultList = {
      progress: { loading: false },
      errors: [],
      data: {
        items: [
          {
            metrics: {
              response_size: [[1716448782519, 57427]],
              start_time: [[1716448782519, 1716448782519]],
              status: [[1716448782519, 0]],
              'synthetic.customMetrics.network_latency': [[1716448782519, 20]],
              'synthetic.customMetrics.cpu_utilization': [[1716448782519, 70]]
            },
            testResultCommonProperties: {
              clientId: 'saas_instana_test',
              id: '969eaddc-7703-47ba-ad92-f4f283475808',
              locationDisplayLabel: 'DemoPoP1(Fyre)',
              locationId: 'RtmxRMdmlakWX497YeZN',
              testId: 'CmIJOrkyB2bHTifXyvqe',
              testName: 'api-simple-demo-test',
              customTags: { Environment: 'Pink', Tag: 'test' }
            }
          }
        ],
        page: 1,
        pageSize: 1,
        totalHits: 1
      }
    };

    const { container } = render(<CustomPropertiesSection resultList={dummyResultList} testType={testType} />);
    expect(container.getElementsByTagName('h2')[0].textContent).toBe('Custom properties');

    expect(document.querySelector('.cds--stack-vertical')?.children.length).toBe(2);

    expect(document.querySelector('.cds--stack-vertical > .cds--css-grid')?.children.length).toBe(3);

    const firstGrid = document.querySelectorAll('.cds--stack-vertical > .cds--css-grid')[0];
    const secondGrid = document.querySelectorAll('.cds--stack-vertical > .cds--css-grid')[1];

    expect(firstGrid.querySelectorAll('.cds--subgrid')[0].children[0]).toHaveTextContent('Environment');
    expect(firstGrid.querySelectorAll('.cds--subgrid')[0].children[1]).toHaveTextContent('Pink');

    expect(firstGrid.querySelectorAll('.cds--subgrid')[1].children[0]).toHaveTextContent('Tag');
    expect(firstGrid.querySelectorAll('.cds--subgrid')[1].children[1]).toHaveTextContent('test');

    expect(firstGrid.querySelectorAll('.cds--subgrid')[2].children[0]).toHaveTextContent('network_latency');
    expect(firstGrid.querySelectorAll('.cds--subgrid')[2].children[1]).toHaveTextContent('20');

    expect(secondGrid.querySelectorAll('.cds--subgrid')[0].children[0]).toHaveTextContent('cpu_utilization');
    expect(secondGrid.querySelectorAll('.cds--subgrid')[0].children[1]).toHaveTextContent('70');
  });

  it('Render correct set of Custom Properties for SSLCertificate test (dsiplay only custom tags)', () => {
    const testType = 'SSLCertificate';
    const dummyResultList = {
      progress: { loading: false },
      errors: [],
      data: {
        items: [
          {
            metrics: {
              response_size: [[1716448782519, 57427]],
              start_time: [[1716448782519, 1716448782519]],
              status: [[1716448782519, 0]],
              'synthetic.customMetrics.daysRemaining': [[1716448782519, 347]],
              'synthetic.customMetrics.valid': [[1716448782519, 1]],
              'synthetic.customMetrics.validFrom': [[1716448782519, 1736380800000]],
              'synthetic.customMetrics.validTo': [[1716448782519, 1769212799000]]
            },
            testResultCommonProperties: {
              clientId: 'saas_instana_test',
              id: '969eaddc-7703-47ba-ad92-f4f283475808',
              locationDisplayLabel: 'DemoPoP1(Fyre)',
              locationId: 'RtmxRMdmlakWX497YeZN',
              testId: 'CmIJOrkyB2bHTifXyvqe',
              testName: 'ssl-certifcate-demo-test',
              customTags: { Environment: 'Pink', Tag: 'test' }
            }
          }
        ],
        page: 1,
        pageSize: 1,
        totalHits: 1
      }
    };

    const { container } = render(<CustomPropertiesSection resultList={dummyResultList} testType={testType} />);
    expect(container.getElementsByTagName('h2')[0].textContent).toBe('Custom properties');

    expect(document.querySelector('.cds--stack-vertical')?.children.length).toBe(1);

    expect(document.querySelector('.cds--stack-vertical > .cds--css-grid')?.children.length).toBe(2);

    const parentGrid = document.querySelectorAll('.cds--stack-vertical > .cds--css-grid')[0];

    expect(parentGrid.querySelectorAll('.cds--subgrid')[0].children[0]).toHaveTextContent('Environment');
    expect(parentGrid.querySelectorAll('.cds--subgrid')[0].children[1]).toHaveTextContent('Pink');

    expect(parentGrid.querySelectorAll('.cds--subgrid')[1].children[0]).toHaveTextContent('Tag');
    expect(parentGrid.querySelectorAll('.cds--subgrid')[1].children[1]).toHaveTextContent('test');
  });
});
