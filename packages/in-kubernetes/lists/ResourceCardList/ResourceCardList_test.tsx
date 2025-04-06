/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { sortByIndex } from 'in-kubernetes/lists/ResourceCardList/ResourceCardList';

describe('sortIndices', () => {
  const items: any = [
    {
      id: '9d4b9489-dbaa-11e9-b1c7-42010a800112',
      namespace: {
        id: 'o_QW7vuk9Xtc3vO5cOnAo6SMsjk',
        clusterDistribution: 'kubernetes',
        label: 'cron-job',
        labels: [
          {
            key: 'kubernetes.io/metadata.name',
            value: 'cron-job'
          }
        ],
        clusterName: 'demo-us-cluster',
        status: 'Active',
        age: 172968979840
      },
      pods: 0,
      services: 0,
      workloads: {
        daemonSets: 0,
        deployments: 0,
        deploymentConfigs: 0,
        statefulSets: 0,
        pods: 0
      },
      entityHealthInfo: {
        maxSeverity: 0,
        openIssues: []
      },
      sortedMetricValue: null,
      label: 'cron-job',
      entityIdForMetric: {
        host: '',
        pluginId: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.namespace.KubernetesNamespace',
        steadyId: '9d4b9489-dbaa-11e9-b1c7-42010a800112'
      },
      clusterName: 'demo-us-cluster',
      snapshotIdForMetric: 'o_QW7vuk9Xtc3vO5cOnAo6SMsjk'
    },
    {
      id: '7d8c5994-4a2d-45d4-97f5-0fb7ca9b02be',
      namespace: {
        id: 'DUlRSog6HvCRnEU0c4Oze36QEpc',
        clusterDistribution: 'openshift',
        label: 'aap',
        labels: [
          {
            key: 'pod-security.kubernetes.io/warn-version',
            value: 'v1.24'
          },
          {
            key: 'kubernetes.io/metadata.name',
            value: 'aap'
          },
          {
            key: 'pod-security.kubernetes.io/audit',
            value: 'restricted'
          },
          {
            key: 'pod-security.kubernetes.io/audit-version',
            value: 'v1.24'
          },
          {
            key: 'pod-security.kubernetes.io/warn',
            value: 'restricted'
          },
          {
            key: 'olm.operatorgroup.uid/7750e671-b9e4-4613-a126-12681c49ca1c',
            value: ''
          }
        ],
        clusterName: 'rca.cp.fyre.ibm.com',
        status: 'Active',
        age: 9633050840
      },
      pods: 4,
      services: 0,
      workloads: {
        daemonSets: 0,
        deployments: 3,
        deploymentConfigs: 0,
        statefulSets: 0,
        pods: 4
      },
      entityHealthInfo: {
        maxSeverity: 0,
        openIssues: []
      },
      sortedMetricValue: null,
      label: 'aap',
      entityIdForMetric: {
        host: '',
        pluginId: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.namespace.KubernetesNamespace',
        steadyId: '7d8c5994-4a2d-45d4-97f5-0fb7ca9b02be'
      },
      clusterName: 'rca.cp.fyre.ibm.com',
      snapshotIdForMetric: 'DUlRSog6HvCRnEU0c4Oze36QEpc'
    },
    {
      id: '223d7581-db9a-11e9-b1c7-42010a800112',
      namespace: {
        id: '9UllKbEIGWQEd-FNAK7Ju1Ui_Qo',
        clusterDistribution: 'kubernetes',
        label: 'default',
        labels: [
          {
            key: 'kubernetes.io/metadata.name',
            value: 'default'
          }
        ],
        clusterName: 'demo-us-cluster',
        status: 'Active',
        age: 172976058840
      },
      pods: 1,
      services: 10,
      workloads: {
        daemonSets: 0,
        deployments: 0,
        deploymentConfigs: 0,
        statefulSets: 0,
        pods: 1
      },
      entityHealthInfo: {
        maxSeverity: 0,
        openIssues: []
      },
      sortedMetricValue: null,
      label: 'default',
      entityIdForMetric: {
        host: '',
        pluginId: 'com.instana.forge.infrastructure.paas.kubernetes.derivedentity.namespace.KubernetesNamespace',
        steadyId: '223d7581-db9a-11e9-b1c7-42010a800112'
      },
      clusterName: 'demo-us-cluster',
      snapshotIdForMetric: '9UllKbEIGWQEd-FNAK7Ju1Ui_Qo'
    }
  ];

  const itemsAdditionalInfo = {
    o_QW7vuk9Xtc3vO5cOnAo6SMsjk: {
      totalRunningPods: 0,
      totalCronJobs: 0,
      totalUnhealthyNodes: 4,
      hasNodesWithOnlyWarnings: true,
      totalUnhealthyDeployments: 0,
      hasDeploymentsWithOnlyWarnings: false
    },
    DUlRSog6HvCRnEU0c4Oze36QEpc: {
      totalRunningPods: 6,
      totalCronJobs: 0,
      totalUnhealthyNodes: 4,
      hasNodesWithOnlyWarnings: true,
      totalUnhealthyDeployments: 0,
      hasDeploymentsWithOnlyWarnings: false
    },
    '9UllKbEIGWQEd-FNAK7Ju1Ui_Qo': {
      totalRunningPods: 1,
      totalCronJobs: 0,
      totalUnhealthyNodes: 4,
      hasNodesWithOnlyWarnings: true,
      totalUnhealthyDeployments: 0,
      hasDeploymentsWithOnlyWarnings: false
    }
  };

  it('should return empty array if items is undefined', () => {
    expect(sortByIndex({}, 'name', 'ASC', undefined)).toEqual([]);
    expect(sortByIndex({}, 'unhealthyDeployments', 'ASC', undefined)).toEqual([]);
    expect(sortByIndex({}, 'runningPods', 'ASC', undefined)).toEqual([]);
    expect(sortByIndex({}, 'services', 'ASC', undefined)).toEqual([]);
    expect(sortByIndex({}, 'cronJobs', 'ASC', undefined)).toEqual([]);
  });

  it('should return unsorted indices if itemsAdditionalInfo is below the threshold', () => {
    const itemsAdditionalInfo = { o_QW7vuk9Xtc3vO5cOnAo6SMsjk: {} };
    expect(sortByIndex(itemsAdditionalInfo, 'name', 'ASC', items)).toEqual([0, 1, 2]);
  });

  it('should return sorted indices when itemsAdditionalInfo meets the threshold', () => {
    expect(sortByIndex(itemsAdditionalInfo, 'name', 'ASC', items)).toEqual([1, 0, 2]);
  });

  it('should return unsorted indices if itemsAdditionalInfo is empty', () => {
    expect(sortByIndex({}, 'name', 'ASC', items)).toEqual([0, 1, 2]);
  });

  it('should return array with sorted indices based on orderBy and orderDirection', async () => {
    expect(sortByIndex(itemsAdditionalInfo, 'name', 'ASC', items)).toEqual([1, 0, 2]);
    expect(sortByIndex(itemsAdditionalInfo, 'name', 'DESC', items)).toEqual([2, 0, 1]);

    expect(sortByIndex(itemsAdditionalInfo, 'unhealthyDeployments', 'ASC', items)).toEqual([1, 0, 2]);
    expect(sortByIndex(itemsAdditionalInfo, 'unhealthyDeployments', 'DESC', items)).toEqual([1, 0, 2]);

    expect(sortByIndex(itemsAdditionalInfo, 'runningPods', 'ASC', items)).toEqual([0, 2, 1]);
    expect(sortByIndex(itemsAdditionalInfo, 'runningPods', 'DESC', items)).toEqual([1, 2, 0]);

    expect(sortByIndex(itemsAdditionalInfo, 'services', 'ASC', items)).toEqual([1, 0, 2]);
    expect(sortByIndex(itemsAdditionalInfo, 'services', 'DESC', items)).toEqual([2, 1, 0]);

    expect(sortByIndex(itemsAdditionalInfo, 'cronJobs', 'ASC', items)).toEqual([1, 0, 2]);
    expect(sortByIndex(itemsAdditionalInfo, 'cronJobs', 'DESC', items)).toEqual([1, 0, 2]);
  });

  it('should sort alphabetically in case it has the same value from sorting criteria', async () => {
    const itemsAdditionalInfo = {
      // cron-job
      o_QW7vuk9Xtc3vO5cOnAo6SMsjk: {
        totalRunningPods: 0,
        totalCronJobs: 2,
        totalUnhealthyNodes: 4,
        hasNodesWithOnlyWarnings: true,
        totalUnhealthyDeployments: 5,
        hasDeploymentsWithOnlyWarnings: false
      },
      //aap
      DUlRSog6HvCRnEU0c4Oze36QEpc: {
        totalRunningPods: 0,
        totalCronJobs: 2,
        totalUnhealthyNodes: 4,
        hasNodesWithOnlyWarnings: true,
        totalUnhealthyDeployments: 1,
        hasDeploymentsWithOnlyWarnings: false
      },
      // default
      '9UllKbEIGWQEd-FNAK7Ju1Ui_Qo': {
        totalRunningPods: 1,
        totalCronJobs: 2,
        totalUnhealthyNodes: 4,
        hasNodesWithOnlyWarnings: true,
        totalUnhealthyDeployments: 5,
        hasDeploymentsWithOnlyWarnings: false
      }
    };

    expect(sortByIndex(itemsAdditionalInfo, 'runningPods', 'ASC', items)).toEqual([1, 0, 2]);
    expect(sortByIndex(itemsAdditionalInfo, 'runningPods', 'DESC', items)).toEqual([2, 1, 0]);

    expect(sortByIndex(itemsAdditionalInfo, 'cronJobs', 'ASC', items)).toEqual([1, 0, 2]);
    expect(sortByIndex(itemsAdditionalInfo, 'cronJobs', 'DESC', items)).toEqual([1, 0, 2]);

    expect(sortByIndex(itemsAdditionalInfo, 'unhealthyDeployments', 'ASC', items)).toEqual([1, 0, 2]);
    expect(sortByIndex(itemsAdditionalInfo, 'unhealthyDeployments', 'DESC', items)).toEqual([0, 2, 1]);
  });
});
