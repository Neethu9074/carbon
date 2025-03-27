/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error not ts file
import { formatForTable } from 'in-events/components/AIChat/chatAPI';

const DATA = {
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

describe('formatForTable', () => {
  it('parses single metric response', () => {
    const fmt = formatForTable(DATA.labelKube);
    const firstLabel = 'aap/aap-gateway-operator-controller-manager';
    expect(fmt.output.generic[0].rows[0].cells[0]).toBe(firstLabel);
    expect(fmt.output.generic[0].rows[0].cells[1]).toBe(123123);
    expect(fmt.output.generic[0].rows[0].cells[2]).toBe('2025-03-26T22:20:54.000Z');
  });
  it('parses two metric response', () => {
    const fmt = formatForTable(DATA.multiple);
    const firstLabel = '/calc/{id}';
    expect(fmt.output.generic[0].rows[0].cells[0]).toBe(firstLabel);
    expect(fmt.output.generic[0].rows[0].cells[1]).toBe(123);
    expect(fmt.output.generic[0].rows[0].cells[2]).toBe(456);
    expect(fmt.output.generic[0].rows[0].cells[3]).toBe('2025-03-26T23:08:00.000Z');
  });
});
