/*
 * IBM Confidential
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

// Import the useObservable hook after mocking
import { useObservable } from '@instana/hooks';
import { TestResultListItem } from '@instana/types';

import {
  createEmptyResultsList,
  createLoadingResultsList,
  createErrorResultsList,
  createPopulatedResultsList
} from 'in-synthetics/dashboards/global/testUtils';
// Import the component after mocking
import { ExpandableResultList } from 'in-synthetics/dashboards/global/tabs/tests/components/ExpandableResultList';

// Mock the useObservable hook
jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('ExpandableResultList', () => {
  const mockTest: TestResultListItem = {
    testResultCommonProperties: {
      id: 'test-result-id',
      testId: 'test-123',
      clientId: 'client-123',
      locationDisplayLabel: 'Location 1',
      testCommonProperties: {
        type: 'HTTP',
        label: 'Test Label',
        id: 'test-common-id',
        active: true,
        frequency: 5,
        locationStatusList: [
          {
            locationId: 'location-1',
            locationDisplayLabel: 'Location 1',
            successRate: 1,
            successRuns: 10,
            totalTestRuns: 10
          }
        ]
      }
    },
    metrics: {
      start_time: [[1754159300000, 1754159400000]],
      status: [[0, 1]],
      response_time: [[0, 200]],
      response_size: [[0, 1024]],
      retries: [[0, 0]],
      errors: [[0, 0]],
      location_id: [[0, 1]]
    }
  };

  const mockRunType = 'Scheduled';

  const mockTimeConfig = {
    to: 1754159400000,
    windowSize: 604800000,
    focusedMoment: 1754159400000,
    autoRefresh: false
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component without any errors', () => {
    // Just verify that the component renders without errors
    render(<ExpandableResultList test={mockTest} runType={mockRunType} timeConfig={mockTimeConfig} />);

    // Should add an assertion to make the test complete:
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders the component correctly with loading state', () => {
    (useObservable as jest.Mock).mockReturnValue(createLoadingResultsList());
    render(<ExpandableResultList test={mockTest} runType={mockRunType} timeConfig={mockTimeConfig} />);
    expect(document.querySelector('.cds--skeleton')).not.toBeNull();

    // Should also verify that the table is not rendered:
    expect(screen.queryByRole('table', { name: /^(?!.*Sample table).*$/i })).not.toBeInTheDocument();
  });

  it('renders the component correctly with empty results', () => {
    (useObservable as jest.Mock).mockReturnValue(createEmptyResultsList());
    render(<ExpandableResultList test={mockTest} runType={mockRunType} timeConfig={mockTimeConfig} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('No results available');
  });

  it('renders the component correctly with error state', () => {
    (useObservable as jest.Mock).mockReturnValue(
      createErrorResultsList({ message: 'Custom error message', code: 'VALIDATION' })
    );
    render(<ExpandableResultList test={mockTest} runType={mockRunType} timeConfig={mockTimeConfig} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Failed to load data');
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders the component correctly with correct data', () => {
    (useObservable as jest.Mock).mockReturnValue(
      createPopulatedResultsList([
        {
          testResultCommonProperties: {
            testId: 'DZMHsUNK2zcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '18WyhtDb5jpVOsjlNdeV',
            clientId: 'saas_instana_test',
            id: '2s63ee06-ad68-47e8-80a9-53f46178baa7',
            errors: [
              '{timeStamp=1754409008365, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'E2ETest PoP',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007878, 1754409007878]],
            retries: [[1754409007878, 0]],
            response_time: [[1754409007878, 487]],
            response_size: [[1754409007878, 0]],
            status: [[1754409007878, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNK2zcUsdcuOwNu',
            testName: 'certificate-check',
            locationId: '7bNbb28j7UnPm8dBdSWm',
            clientId: 'saas_instana_test',
            id: '2e9ed508-sf1d-42e7-868f-49656b6a3ef6',
            errors: [
              '{timeStamp=1754409008179, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'czhang-pink-master',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007789, 1754409007789]],
            retries: [[1754409007789, 0]],
            response_time: [[1754409007789, 389]],
            response_size: [[1754409007789, 0]],
            status: [[1754409007789, 0]]
          }
        }
      ] as unknown as TestResultListItem[])
    );
    render(<ExpandableResultList test={mockTest} runType={mockRunType} timeConfig={mockTimeConfig} />);
    expect(document.querySelectorAll('.cds--table-header-label')[0]).toHaveTextContent('Status');
    expect(document.querySelectorAll('.cds--table-header-label')[1]).toHaveTextContent('Started');
    expect(document.querySelectorAll('.cds--table-header-label')[2]).toHaveTextContent('Response time');
    expect(document.querySelectorAll('.cds--table-header-label')[3]).toHaveTextContent('Retry count');
    expect(document.querySelectorAll('.cds--table-header-label')[4]).toHaveTextContent('Error message');

    // Should also check that cell values match the mock data:
    expect(screen.getAllByText('certificate validated remain days is less than 90 days')[0]).toBeInTheDocument();
  });

  it('renders the component with pagination correctly for results list with more than 10 items', () => {
    (useObservable as jest.Mock).mockReturnValue(
      createPopulatedResultsList([
        {
          testResultCommonProperties: {
            testId: 'DZMHsUNs2zcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '18WyhtDb5jpVOsjlNdeV',
            clientId: 'saas_instana_test',
            id: '266see06-sd68-47e8-80a9-53f46178baa7',
            errors: [
              '{timeStamp=1754409008365, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'E2ETest PoP',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007878, 1754409007878]],
            retries: [[1754409007878, 0]],
            response_time: [[1754409007878, 487]],
            response_size: [[1754409007878, 0]],
            status: [[1754409007878, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHsUNs2zcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '7bNbb28j7UnPm8dBdSWm',
            clientId: 'saas_instana_test',
            id: '2e9ed5s8-bfsd-42e7-868f-49656b6a3ef6',
            errors: [
              '{timeStamp=1754409008179, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'czhang-pink-master',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007789, 1754409007789]],
            retries: [[1754409007789, 0]],
            response_time: [[1754409007789, 389]],
            response_size: [[1754409007789, 0]],
            status: [[1754409007789, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNKsscU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '18WyhtDb5jpVOsjlNdeV',
            clientId: 'saas_instana_test',
            id: '2663ee06-ask8-47e8-80a9-53f46178baa7',
            errors: [
              '{timeStamp=1754409008365, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'E2ETest PoP',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007878, 1754409007878]],
            retries: [[1754409007878, 0]],
            response_time: [[1754409007878, 487]],
            response_size: [[1754409007878, 0]],
            status: [[1754409007878, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMspUNs2zcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '7bNbb8j7UnPm8dBdSWm',
            clientId: 'saas_instana_test',
            id: '2e9ed5s8-bf1d-42s7-868f-49656b6a3ef6',
            errors: [
              '{timeStamp=1754409008179, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'czhang-pink-master',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007789, 1754409007789]],
            retries: [[1754409007789, 0]],
            response_time: [[1754409007789, 389]],
            response_size: [[1754409007789, 0]],
            status: [[1754409007789, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMGpUNKszcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '18WyhtDb5jpVOsjlNdeV',
            clientId: 'saas_instana_test',
            id: '2663ee0s-ad68-4se8-80a9-53f46178baa7',
            errors: [
              '{timeStamp=1754409008365, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'E2ETest PoP',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007878, 1754409007878]],
            retries: [[1754409007878, 0]],
            response_time: [[1754409007878, 487]],
            response_size: [[1754409007878, 0]],
            status: [[1754409007878, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DYMHpUNKszcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '7bNbb28j7UnPm8dBdSWm',
            clientId: 'saas_instana_test',
            id: '2e9ef508-bf1d-s2e7-868f-49656b6a3ef6',
            errors: [
              '{timeStamp=1754409008179, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'czhang-pink-master',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007789, 1754409007789]],
            retries: [[1754409007789, 0]],
            response_time: [[1754409007789, 389]],
            response_size: [[1754409007789, 0]],
            status: [[1754409007789, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNK2zsU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '18WyhtDb5jpVOsjlNdeV',
            clientId: 'saas_instana_test',
            id: '2663ee06-ad6s-47e8-80a9-53f46178baa7',
            errors: [
              '{timeStamp=1754409008365, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'E2ETest PoP',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007878, 1754409007878]],
            retries: [[1754409007878, 0]],
            response_time: [[1754409007878, 487]],
            response_size: [[1754409007878, 0]],
            status: [[1754409007878, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNs2zcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '7bNbb28j7UnPm8dBdSWm',
            clientId: 'saas_instana_test',
            id: '2e9ed508-bf1d-42e786s8f-49656b6a3ef6',
            errors: [
              '{timeStamp=1754409008179, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'czhang-pink-master',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007789, 1754409007789]],
            retries: [[1754409007789, 0]],
            response_time: [[1754409007789, 389]],
            response_size: [[1754409007789, 0]],
            status: [[1754409007789, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNKszcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '18WyhtDb5jpVOsjlNdeV',
            clientId: 'saas_instana_test',
            id: '2663ee06-ad68-47e8-80s9-53f46178baa7',
            errors: [
              '{timeStamp=1754409008365, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'E2ETest PoP',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007878, 1754409007878]],
            retries: [[1754409007878, 0]],
            response_time: [[1754409007878, 487]],
            response_size: [[1754409007878, 0]],
            status: [[1754409007878, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNs2zcU0dcuOwNu',
            testName: 'certificate-check',
            locationId: '7bNbb28j7UnPm8dBdSWm',
            clientId: 'saas_instana_test',
            id: '2e9ed508-bf1d-42s7-868f-49656b6a3ef6',
            errors: [
              '{timeStamp=1754409008179, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'czhang-pink-master',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007789, 1754409007789]],
            retries: [[1754409007789, 0]],
            response_time: [[1754409007789, 389]],
            response_size: [[1754409007789, 0]],
            status: [[1754409007789, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNK2zcUsdcuOwNu',
            testName: 'certificate-check',
            locationId: '18WyhtDb5jpVOsjlNdeV',
            clientId: 'saas_instana_test',
            id: '2663ee06-ad68-47e8-8sa9-53f46178baa7',
            errors: [
              '{timeStamp=1754409008365, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'E2ETest PoP',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007878, 1754409007878]],
            retries: [[1754409007878, 0]],
            response_time: [[1754409007878, 487]],
            response_size: [[1754409007878, 0]],
            status: [[1754409007878, 0]]
          }
        },
        {
          testResultCommonProperties: {
            testId: 'DZMHpUNK2zcs0dcuOwNu',
            testName: 'certificate-check',
            locationId: '7bNbb28j7UnPm8dBdSWm',
            clientId: 'saas_instana_test',
            id: '2e9ed508-bf1d-42e7-868f-496s6b6a3ef6',
            errors: [
              '{timeStamp=1754409008179, errorType=Assertion, errorMessage=certificate validated remain days is less than 90 days, stackTrace=AssertionError [ERR_ASSERTION]: certificate validated remain days is less than 90 days\n    at ReadOnlyHandler.apply (vm/bridge.js:468:15)\n    at getSslDetails (/tmp/DZMHpUNK2zcU0dcuOwNu/script.js:10:10)\n    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)}'
            ],
            locationDisplayLabel: 'czhang-pink-master',
            runType: 'Scheduled',
            sslDaysRemaining: null,
            testLastError: null
          },
          metrics: {
            start_time: [[1754409007789, 1754409007789]],
            retries: [[1754409007789, 0]],
            response_time: [[1754409007789, 389]],
            response_size: [[1754409007789, 0]],
            status: [[1754409007789, 0]]
          }
        }
      ] as unknown as TestResultListItem[])
    );
    render(<ExpandableResultList test={mockTest} runType={mockRunType} timeConfig={mockTimeConfig} />);
    expect(document.querySelector('.cds--pagination')).not.toBeNull();
  });
});
