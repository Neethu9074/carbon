/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error not ts file
import { formatForTable, sendAPIQuery, fetchAPIData } from 'in-events/components/AIChat/chatAPI';

const DATA = {
  emptyItems: {
    items: []
  },
  noName: {
    items: [
      {
        snapshotId: 'VaxDbMS49-pE67cnSvYXy0QxPaA',
        label: 'instana-agent/controller-manager-5cd6df6d96-75bwg',
        plugin: 'kubernetesPod',
        time: 1742765760000,
        metrics: {
          'cpuRequests.MEAN': [[1743057172000, 0.199999880616829]]
        },
        tags: {
          notAName: 'instana-agent/controller-manager-5cd6df6d96-75bwg'
        },
        entityHealthInfo: {
          maxSeverity: 0.0,
          openIssues: []
        }
      }
    ]
  },
  noTimestamp: {
    // show me latency and number of calls for service shipping
    items: [
      {
        name: '/calc/{id}',
        timestamp: 1743028884856,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 1
        },
        count: 987,
        metrics: {
          'calls.sum': [[null, 123]],
          'latency.mean': [[null, 456]]
        }
      }
    ]
  },
  parse: {
    items: [
      {
        snapshotId: 'VaxDbMS49-pE67cnSvYXy0QxPaA',
        label: 'instana-agent/controller-manager-5cd6df6d96-75bwg',
        plugin: 'kubernetesPod',
        time: 1742765760000,
        metrics: {
          'cpuRequests.MEAN': [[1743057172000, 0.199999880616829]]
        },
        tags: {
          'label.kubernetesPod': 'instana-agent/controller-manager-5cd6df6d96-75bwg',
          'id.kubernetesPod': 'VaxDbMS49-pE67cnSvYXy0QxPaA'
        },
        entityHealthInfo: {
          maxSeverity: 0.0,
          openIssues: []
        }
      }
    ]
  },
  showCount: {
    items: [
      {
        tags: {
          'kubernetes.deployment.name': 'aap-gateway-operator-controller-manager'
        },
        count: 987,
        metrics: {}
      }
    ]
  },
  multipleWithCount: {
    // show me latency and number of calls for service shipping
    items: [
      {
        name: '/calc/{id}',
        timestamp: 1743028884856,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 1
        },
        count: 987,
        metrics: {
          'calls.sum': [[1743030480000, 123]],
          'latency.mean': [[1743030480000, 456]]
        }
      },
      {
        name: '/cities/{code}',
        timestamp: 1743028874282,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 2
        },
        count: 987,
        metrics: {
          'calls.sum': [[1743030480000, 32]],
          'latency.mean': [[1743030480000, 1936.78125]]
        }
      }
    ]
  },
  multiple: {
    // show me latency and number of calls for service shipping
    items: [
      {
        name: '/calc/{id}',
        timestamp: 1743028884856,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 1
        },
        metrics: {
          'calls.sum': [[1743030480000, 123]],
          'latency.mean': [[1743030480000, 456]]
        }
      },
      {
        name: '/cities/{code}',
        timestamp: 1743028874282,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 2
        },
        metrics: {
          'calls.sum': [[1743030480000, 32]],
          'latency.mean': [[1743030480000, 1936.78125]]
        }
      }
    ]
  },
  labelKube: {
    // Show me the average of desired replicas for all deployments
    items: [
      {
        snapshotId: 'JUrkna6ww4BNpK28Rb94NgOhUqA',
        label: 'aap/aap-gateway-operator-controller-manager',
        plugin: 'kubernetesDeployment',
        time: 9223372036854775000,
        metrics: {
          'desiredReplicas.MEAN': [[1743027654000, 123123]]
        },
        tags: {
          'id.kubernetesDeployment': 'JUrkna6ww4BNpK28Rb94NgOhUqA',
          'label.kubernetesDeployment': 'aap/aap-gateway-operator-controller-manager'
        },
        entityHealthInfo: {
          maxSeverity: 0,
          openIssues: []
        }
      },
      {
        snapshotId: 'NKDezX1GlJ1dH_G6nrxLJ7CiHZs',
        label: 'aap/ansible-lightspeed-operator-controller-manager',
        plugin: 'kubernetesDeployment',
        time: 9223372036854775000,
        metrics: {
          'desiredReplicas.MEAN': [[1743027654000, 1]]
        },
        tags: {
          'id.kubernetesDeployment': 'NKDezX1GlJ1dH_G6nrxLJ7CiHZs',
          'label.kubernetesDeployment': 'aap/ansible-lightspeed-operator-controller-manager'
        },
        entityHealthInfo: {
          maxSeverity: 0,
          openIssues: []
        }
      }
    ]
  }
};

const mockAIFeatureFlag = jest.fn();
jest.mock('in-services/featureFlags', () => ({
  get automationActionAiGenerationUnitEnabled() {
    return mockAIFeatureFlag();
  }
}));

const mockHttpFunc = jest.fn();
jest.mock('in-services/http', () => ({
  __esModule: true,
  get default() {
    return mockHttpFunc;
  }
}));

const sampleReturn = [{ body: {} }];

describe('fetchAPIData', () => {
  it('should remove api_endpoint from payload', () => {
    mockHttpFunc.mockReturnValue(sampleReturn);
    const value = fetchAPIData({ api_endpoint: 654, windowStart: 987 });
    expect(value).not.toBeNull();
    expect(mockHttpFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { windowStart: 987 }
      })
    );
    expect(mockHttpFunc).not.toHaveBeenCalledWith(
      expect.objectContaining({
        data: { api_endpoint: 654 }
      })
    );
  });
});

describe('sendAPIQuery', () => {
  it('should return null if AI agreement is not signed', () => {
    mockAIFeatureFlag.mockReturnValue(false);
    const value = sendAPIQuery({});
    expect(value).toBeNull();
  });
  it('should correctly structure the request', () => {
    mockAIFeatureFlag.mockReturnValue(true);
    mockHttpFunc.mockReturnValue(sampleReturn);
    const value = sendAPIQuery({ windowStart: 123 });
    expect(value).not.toBeNull();
    expect(mockHttpFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { query: { windowStart: 123 } }
      })
    );
  });
});

describe('formatForTable', () => {
  it('works with empty items array', () => {
    const fmt = formatForTable(DATA.emptyItems);
    expect(fmt.output.generic[0].rows.length).toBe(0);
  });
  it('returns empty result if no primary column is found', () => {
    const fmt = formatForTable(DATA.noName);
    expect(fmt.output.generic[0].rows.length).toBe(0);
  });
  it('does not error if timestamp is undefined', () => {
    const fmt = formatForTable(DATA.noTimestamp);
    const firstRow = fmt.output.generic[0].rows[0].cells;
    expect(firstRow[firstRow.length - 1]).toBeUndefined();
  });
  it('parses single metric response', () => {
    const fmt = formatForTable(DATA.labelKube);
    const firstLabel = 'aap/aap-gateway-operator-controller-manager';
    expect(fmt.output.generic[0].rows[0].cells[0]).toBe(firstLabel);
    expect(fmt.output.generic[0].rows[0].cells[1]).toBe(123123);
    expect(fmt.output.generic[0].rows[0].cells[2]).toBe('2025-03-26T22:20:54.000Z');
  });
  it('parses two metric response with count', () => {
    const fmt = formatForTable(DATA.multipleWithCount);
    expect(fmt.output.generic[0].headers[0]).toBe('Name');
    expect(fmt.output.generic[0].headers[1]).toBe('# Calls');
    expect(fmt.output.generic[0].headers[2]).toBe('Mean latency');
    expect(fmt.output.generic[0].headers[3]).toBe('Count');
    expect(fmt.output.generic[0].headers[4]).toBe('Timestamp');
    expect(fmt.output.generic[0].rows[0].cells[1]).toBe(123);
    expect(fmt.output.generic[0].rows[0].cells[2]).toBe(456);
    expect(fmt.output.generic[0].rows[0].cells[3]).toBe(987);
    expect(fmt.output.generic[0].rows[0].cells[4]).toBe('2025-03-26T23:08:00.000Z');
  });
  it('parses two metric response', () => {
    const fmt = formatForTable(DATA.multiple);
    const firstLabel = '/calc/{id}';
    expect(fmt.output.generic[0].headers[0]).toBe('Name');
    expect(fmt.output.generic[0].headers[1]).toBe('# Calls');
    expect(fmt.output.generic[0].headers[2]).toBe('Mean latency');
    expect(fmt.output.generic[0].headers[3]).toBe('Timestamp');
    expect(fmt.output.generic[0].rows[0].cells[0]).toBe(firstLabel);
    expect(fmt.output.generic[0].rows[0].cells[1]).toBe(123);
    expect(fmt.output.generic[0].rows[0].cells[2]).toBe(456);
    expect(fmt.output.generic[0].rows[0].cells[3]).toBe('2025-03-26T23:08:00.000Z');
  });
  it('shows count as a column', () => {
    const fmt = formatForTable(DATA.showCount);
    const firstLabel = 'aap-gateway-operator-controller-manager';
    expect(fmt.output.generic[0].rows[0].cells[0]).toBe(firstLabel);
    expect(fmt.output.generic[0].rows[0].cells[1]).toBe(987);
  });
  it('parses correctly', () => {
    const fmt = formatForTable(DATA.parse);
    const firstLabel = 'instana-agent/controller-manager-5cd6df6d96-75bwg';
    expect(fmt.output.generic[0].rows[0].cells[0]).toBe(firstLabel);
    expect(fmt.output.generic[0].rows[0].cells[1]).toBe(0.199999880616829);
  });
});
