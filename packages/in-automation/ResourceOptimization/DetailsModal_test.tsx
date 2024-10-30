/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { AgentSnapshot, RecommendedAction } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { runResourceOptimizationAction } from 'in-automation/api';
import { useResourceImpacts } from './useResourceOptimization';
import { useSegmentTracker } from 'in-automation/tracker';
import DetailsModal from './DetailsModal';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('./useResourceOptimization', () => ({
  useResourceImpacts: jest.fn()
}));

jest.mock('in-automation/api', () => ({
  runResourceOptimizationAction: jest.fn()
}));

jest.mock('in-automation/tracker', () => ({
  useSegmentTracker: jest.fn()
}));

const mockRunOptimizationTrackerSegment = jest.fn();

beforeEach(() => {
  (useObservable as jest.Mock).mockImplementation(() => mockResourceImpactResult);
  (useResourceImpacts as jest.Mock).mockImplementation(() => mockResourceImpactResult);
  (runResourceOptimizationAction as jest.Mock).mockImplementation(() => ({
    once: (func: Function) =>
      func({
        actionName: 'Test',
        source: 'Turbonomic',
        errorMessage: 'Test message'
      })
  }));
  (useSegmentTracker as jest.Mock).mockImplementation(() => ({
    runOptimizationTrackerSegment: mockRunOptimizationTrackerSegment
  }));
});

interface DetailsModalProps {
  currentAction: RecommendedAction;
  agents: AgentSnapshot[];
}

const props: DetailsModalProps = {
  currentAction: {
    id: '638625938196418:2024-09-30T19:05:22Z',
    name: 'Move Container Pod openshift-monitoring/prometheus-k8s-0 from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com',
    description: '"openshift-monitoring/prometheus-k8s-0" doesn\'t comply with "Movetoworker3"',
    actionType: 'MOVE',
    actionCategory: 'COMPLIANCE',
    impactedServices: '0',
    createdDate: 1728531187625,
    targetSnapshotId: 'testID',
    actionDetailsURL:
      'https://nginx-turbonomic.apps.zturbo.cp.fyre.ibm.com/app/index.html#/view/main/action/638625938196418',
    targetClass: 'ContainerPod'
  },
  agents: [
    {
      timestamp: 1728475691000,
      from: 1728475691000,
      to: undefined,
      label: 'Instana Agent @ zrhel81',
      data: {
        'memory.nativeTotal': 134217728,
        capabilities: [
          'gitops',
          'logdownload',
          'agentSupportInfo',
          'agentprofiler',
          'turbonomic-action',
          'log4j-safe-lib'
        ],
        startedAt: 1727985949361,
        'memory.total': 151343104,
        pid: '189082',
        mode: 2,
        hostname: 'zrhel81',
        java: {
          vmversion: '25.422-b05',
          version: '1.8.0_422',
          vmname: 'OpenJDK 64-Bit Server VM',
          vmvendor: 'Azul Systems, Inc.'
        },
        git: {
          present: true,
          initialized: false
        },
        hasCpuLoad: true,
        updateMode: 'Auto',
        'log.counts.byMessage': {
          ERROR: 'ERROR',
          WARN: 'WARN'
        },
        loglevel: 'TRACE',
        agentVersion: '2024.10.09.1210-internal',
        metrics: true,
        boot: '1.2.34',
        user: 'root',
        logAsRate: true
      },
      monitoringIssuesTotalCount: 2,
      monitoringIssuesCountByCategory: {
        SENSOR: {
          process: 2
        }
      },
      id: '1efyNiNEJdguvGvgWx7uHhrKo7g',
      plugin: 'instanaAgent',
      entityId: {
        host: '00:00:0a:ff:fe:15:67:93',
        pluginId: 'com.instana.forge.infrastructure.application.instana.agent.InstanaAgent',
        steadyId: 'self'
      },
      volatileId: {
        host_id: '00:00:0a:ff:fe:15:67:93',
        sensor_name: 'com.instana.agent',
        entity_id: 'self'
      },
      processorTags: [],
      metricIds: [
        'sensors.scheduler.poolStats.scheduler.activeCount',
        'sensors.scheduler.poolStats.executor.activeCount',
        'sensors.scheduler.poolStats.scheduler.queueSize',
        'net.tx'
      ]
    }
  ]
};

const mockResourceImpactResult = {
  data: {
    errorMessage: '',
    actionType: 'MOVE',
    entityType: 'ContainerPod',
    entitiesList: [
      {
        name: 'openshift-monitoring/prometheus-k8s-0',
        type: 'ContainerPod',
        resourceImpactDataList: []
      },
      {
        name: 'worker2.zturbo.cp.fyre.ibm.com',
        type: 'VirtualMachine',
        resourceImpactDataList: [
          {
            name: 'Virtual CPU Limit',
            before: '32.00',
            after: '32.00',
            units: 'GHz'
          },
          {
            name: 'Smoothed Virtual CPU Limit',
            before: '6.97',
            after: '4.52',
            units: '%'
          },
          {
            name: 'Virtual Memory Limit',
            before: '30.60',
            after: '30.60',
            units: 'GB'
          },
          {
            name: 'Smoothed Virtual Memory Limit',
            before: '33.84',
            after: '20.34',
            units: '%'
          }
        ]
      },
      {
        name: 'worker3.zturbo.cp.fyre.ibm.com',
        type: 'VirtualMachine',
        resourceImpactDataList: [
          {
            name: 'Virtual CPU Limit',
            before: '32.00',
            after: '32.00',
            units: 'GHz'
          },
          {
            name: 'Smoothed Virtual CPU Limit',
            before: '2.42',
            after: '18.63',
            units: '%'
          },
          {
            name: 'Virtual Memory Limit',
            before: '30.60',
            after: '30.60',
            units: 'GB'
          },
          {
            name: 'Smoothed Virtual Memory Limit',
            before: '35.16',
            after: '99.45',
            units: '%'
          }
        ]
      }
    ]
  },
  errors: [],
  progress: {
    loading: false
  },
  time: 1728532976599
};

describe('DetailsModal Initial Render', () => {
  beforeEach(jest.clearAllMocks);

  it('Resource optimization details modal renders ', () => {
    render(<DetailsModal {...props} />);
    expect(screen.getByText('Resource optimization details')).toBeInTheDocument();
  });

  it('Shows the action description, category, and risk details', () => {
    render(<DetailsModal {...props} />);
    screen.getByText(
      'Move Container Pod openshift-monitoring/prometheus-k8s-0 from worker2.zturbo.cp.fyre.ibm.com to worker3.zturbo.cp.fyre.ibm.com'
    );
    screen.getByText('Compliance');
    screen.getByText('"openshift-monitoring/prometheus-k8s-0" doesn\'t comply with "Movetoworker3"');
  });

  it('displays resource impacts', async () => {
    (useResourceImpacts as jest.Mock).mockImplementationOnce(() => mockResourceImpactResult);

    render(<DetailsModal {...props} />);
    expect(screen.getByText('worker3.zturbo.cp.fyre.ibm.com')).toBeInTheDocument();
    expect(screen.getByText('openshift-monitoring/prometheus-k8s-0')).toBeInTheDocument();
  });

  it('displays error messages when errors are present', () => {
    const errorData = {
      progress: { loading: false },
      errors: [],
      data: {
        ...mockResourceImpactResult.data,
        errorMessage: 'No resource impacts found'
      }
    };
    (useResourceImpacts as jest.Mock).mockImplementationOnce(() => errorData);
    render(<DetailsModal {...props} />);
    expect(screen.getByText('No resource impacts found')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    const loadingData = {
      progress: { loading: true },
      errors: [],
      data: {}
    };
    (useResourceImpacts as jest.Mock).mockImplementationOnce(() => loadingData);
    const { container } = render(<DetailsModal {...props} />);
    const element = container.querySelector('.cds--skeleton__placeholder');
    expect(element).toBeInTheDocument();
  });

  it('react to run action button click', () => {
    render(<DetailsModal {...props} />);
    const runButton = screen.getByText('Run action');
    fireEvent.click(runButton);
    expect(mockRunOptimizationTrackerSegment).toHaveBeenCalled();
    (runResourceOptimizationAction as jest.Mock).mockImplementation(() => ({
      once: (func: Function) =>
        func({
          actionName: 'Test',
          source: 'Turbonomic'
        })
    }));
    fireEvent.click(runButton);
    expect(mockRunOptimizationTrackerSegment).toHaveBeenCalled();
  });
});
