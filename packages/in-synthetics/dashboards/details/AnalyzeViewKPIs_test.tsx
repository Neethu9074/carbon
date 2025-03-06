/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { cleanup, screen, render } from '@testing-library/react';
import React from 'react';

import AnalyzeViewKPIs from 'in-synthetics/dashboards/details/AnalyzeViewKPIs';

describe(AnalyzeViewKPIs, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render correct set of KPIs for HTTPAction test', () => {
    const startTime = 1716448782519;
    const status = 0;
    const responseTime = 61391;
    const responseSize = '57427';
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
              status: [[1716448782519, 0]]
            },
            testResultCommonProperties: {
              clientId: 'saas_instana_test',
              id: '969eaddc-7703-47ba-ad92-f4f283475808',
              locationDisplayLabel: 'DemoPoP1(Fyre)',
              locationId: 'RtmxRMdmlakWX497YeZN',
              testId: 'CmIJOrkyB2bHTifXyvqe',
              testName: 'api-simple-demo-test'
            }
          }
        ],
        page: 1,
        pageSize: 1,
        totalHits: 1
      }
    };
    const dummyTimelineDetails = {
      progress: { loading: false },
      errors: [],
      data: {
        subtransactionAvgMetrics: {
          blocking: 0,
          connect: 45,
          dns: 135,
          receiving: 0,
          sending: 1,
          ssl: -1,
          waiting: 34208
        },
        subtransactions: [
          {
            metrics: {
              blocking: 0,
              connect: 45,
              connectCount: 1,
              contentType: 'text/html',
              dns: 135,
              downloadSpeed: 0,
              httpOperation: 'GET',
              receiving: 0,
              redirectCount: 0,
              redirectTime: 0,
              requestSize: 0,
              responseSize: 1132,
              responseTime: 34389,
              retries: 0,
              sending: 1,
              ssl: -1,
              status: 1,
              statusCode: 500,
              uploadSpeed: 0,
              uri: 'http://www.bing.com/',
              waiting: 34208
            },
            properties: {
              currentUUID: '3d1f0b00-18d5-11ef-843f-c1cefadf3cdd',
              finishTime: 1716448960430,
              startTime: 1716448926041
            }
          }
        ],
        testId: 'CmIJOrkyB2bHTifXyvqe',
        testResultId: 'f5420614-7371-4d44-b50c-ad7bf46dff17'
      }
    };
    render(
      <AnalyzeViewKPIs
        startTime={startTime}
        status={status}
        responseTime={responseTime}
        responseSize={responseSize}
        testType={testType}
        timelineDetails={dummyTimelineDetails}
        resultList={dummyResultList}
      />
    );
    expect(screen.getByText('Start Time')).toBeVisible();
    expect(screen.getByText('Status')).toBeVisible();
    expect(screen.getByText('Response Time')).toBeVisible();
    expect(screen.getByText('Requests')).toBeVisible();
    expect(screen.getByText('Response Size')).toBeVisible();

    expect(screen.queryByText('Certificate is Signed by Public CA')).toBeNull();
  });

  it('Render correct set of KPIs for SSLCertificate test', () => {
    const startTime = 1716448782519;
    const status = 0;
    const responseTime = 536;
    const responseSize = '0';
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
              'synthetic.customMetrics.daysRemaining': [[1716448716043, 344]],
              'synthetic.customMetrics.valid': [[1716448716043, 1]],
              'synthetic.customMetrics.validFrom': [[1716448716043, 1714608000000]],
              'synthetic.customMetrics.validTo': [[1716448716043, 1746143999000]]
            },
            testResultCommonProperties: {
              clientId: 'saas_instana_test',
              id: '969eaddc-7703-47ba-ad92-f4f283475808',
              locationDisplayLabel: 'DemoPoP1(Fyre)',
              locationId: 'RtmxRMdmlakWX497YeZN',
              testId: 'M880kqJJbuDYMjrKhBdG',
              testName: 'ssl-certificate-demo-test'
            }
          }
        ],
        page: 1,
        pageSize: 1,
        totalHits: 1
      }
    };

    const dummyTimelineDetails = {
      progress: { loading: false },
      errors: [],
      data: {
        subtransactionAvgMetrics: {
          blocking: 0,
          connect: 45,
          dns: 135,
          receiving: 0,
          sending: 1,
          ssl: -1,
          waiting: 34208
        },
        subtransactions: [
          {
            metrics: {
              blocking: 0,
              connect: 45,
              connectCount: 1,
              contentType: 'text/html',
              dns: 135,
              downloadSpeed: 0,
              httpOperation: 'GET',
              receiving: 0,
              redirectCount: 0,
              redirectTime: 0,
              requestSize: 0,
              responseSize: 1132,
              responseTime: 34389,
              retries: 0,
              sending: 1,
              ssl: -1,
              status: 1,
              statusCode: 500,
              uploadSpeed: 0,
              uri: 'http://www.bing.com/',
              waiting: 34208
            },
            properties: {
              currentUUID: '3d1f0b00-18d5-11ef-843f-c1cefadf3cdd',
              finishTime: 1716448960430,
              startTime: 1716448926041
            }
          }
        ],
        testId: 'CmIJOrkyB2bHTifXyvqe',
        testResultId: 'f5420614-7371-4d44-b50c-ad7bf46dff17'
      }
    };
    render(
      <AnalyzeViewKPIs
        startTime={startTime}
        status={status}
        responseTime={responseTime}
        responseSize={responseSize}
        testType={testType}
        timelineDetails={dummyTimelineDetails}
        resultList={dummyResultList}
      />
    );
    expect(screen.getByText('Start Time')).toBeVisible();
    expect(screen.getByText('Status')).toBeVisible();
    expect(screen.getByText('Response Time')).toBeVisible();
    expect(screen.getByText('Certificate is Signed by Public CA')).toBeVisible();

    expect(screen.queryByText('Requests')).toBeNull();
    expect(screen.queryByText('Response Size')).toBeNull();
  });

  it('Render correct set of KPIs for DNS test', () => {
    const startTime = 1716448782519;
    const status = 0;
    const responseTime = 536;
    const responseSize = '0';
    const testType = 'DNS';
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
              id: '969eaddc-7703-47ba-ad92-f4f283475808',
              locationDisplayLabel: 'DemoPoP1(Fyre)',
              locationId: 'RtmxRMdmlakWX497YeZN',
              testId: 'M880kqJJbuDYMjrKhBdG',
              testName: 'ssl-certificate-demo-test'
            }
          }
        ],
        page: 1,
        pageSize: 1,
        totalHits: 1
      }
    };

    const dummyTimelineDetails = {
      progress: { loading: false },
      errors: [],
      data: {
        subtransactionAvgMetrics: {
          blocking: 0,
          connect: 45,
          dns: 135,
          receiving: 0,
          sending: 1,
          ssl: -1,
          waiting: 34208
        },
        subtransactions: [
          {
            metrics: {
              blocking: 0,
              connect: 45,
              connectCount: 1,
              contentType: 'text/html',
              dns: 135,
              downloadSpeed: 0,
              httpOperation: 'GET',
              receiving: 0,
              redirectCount: 0,
              redirectTime: 0,
              requestSize: 0,
              responseSize: 1132,
              responseTime: 34389,
              retries: 0,
              sending: 1,
              ssl: -1,
              status: 1,
              statusCode: 500,
              uploadSpeed: 0,
              uri: 'http://www.bing.com/',
              waiting: 34208
            },
            properties: {
              currentUUID: '3d1f0b00-18d5-11ef-843f-c1cefadf3cdd',
              finishTime: 1716448960430,
              startTime: 1716448926041
            }
          }
        ],
        testId: 'CmIJOrkyB2bHTifXyvqe',
        testResultId: 'f5420614-7371-4d44-b50c-ad7bf46dff17'
      }
    };
    render(
      <AnalyzeViewKPIs
        startTime={startTime}
        status={status}
        responseTime={responseTime}
        responseSize={responseSize}
        testType={testType}
        timelineDetails={dummyTimelineDetails}
        resultList={dummyResultList}
      />
    );
    expect(screen.getByText('Start Time')).toBeVisible();
    expect(screen.getByText('Status')).toBeVisible();
    expect(screen.getByText('Response Time')).toBeVisible();

    expect(screen.queryByText('Requests')).toBeNull();
    expect(screen.queryByText('Response Size')).toBeNull();
  });
});
