/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { KubernetesClusterListItem } from 'in-types';
import { sortBy } from 'in-kubernetes/utils';

const items: KubernetesClusterListItem[] = [
  {
    id: 'ab80188d-f797-4fe0-8de9-627ea3200635',
    cluster: {
      id: 'TI9PQ9XPuMK4I_4HMT_NzQ5Bobs',
      clusterDistribution: 'openshift',
      clusterManagedBy: 'none',
      clusterManagement: {
        shortName: 'none',
        fullName: 'none'
      },
      label: 'FG-OCP-cluster',
      version: 'v1.30.7',
      componentStatuses: [],
      debuggingInfo: {
        Leader: 'instana-agent-k8sensor-6649bd6d8-nlqgg',
        'Missing Resource Watches': 'None',
        UUID: 'ab80188d-f797-4fe0-8de9-627ea3200635'
      },
      missingAppsPermissions: false
    },
    namespaces: 71,
    nodes: 6,
    services: 89,
    persistentVolumes: 1,
    nodeCounters: {
      totalNodes: 2,
      criticalNodes: 0,
      warningNodes: 0
    },
    workloads: {
      daemonSets: 16,
      deployments: 62,
      deploymentConfigs: 0,
      statefulSets: 2,
      pods: 256,
      deploymentCounters: {
        totalDeployments: 62,
        criticalDeployments: 0,
        warningDeployments: 0
      },
      podCounters: {
        totalPods: 29,
        runningPods: 4
      }
    },
    cronJobs: 2,
    entityHealthInfo: {
      maxSeverity: 0,
      openIssues: []
    },
    name: 'FG-OCP-cluster'
  },
  {
    id: 'e415bd1f-7a0f-4baa-a6b0-1228b98fe73c',
    cluster: {
      id: '27iqVZWmdP9us6cDHn67msnY_OQ',
      clusterDistribution: 'kubernetes',
      clusterManagedBy: 'none',
      clusterManagement: {
        shortName: 'none',
        fullName: 'none'
      },
      label: 'FG-cluster',
      version: 'v1.30.4+k3s1',
      componentStatuses: [],
      debuggingInfo: {
        Leader: 'instana-agent-k8sensor-58b55dfb9b-26ksz',
        'Missing Resource Watches': 'None',
        UUID: 'e415bd1f-7a0f-4baa-a6b0-1228b98fe73c'
      },
      missingAppsPermissions: false
    },
    namespaces: 5,
    nodes: 3,
    nodeCounters: {
      totalNodes: 3,
      criticalNodes: 0,
      warningNodes: 0
    },
    services: 7,
    persistentVolumes: 0,
    workloads: {
      daemonSets: 2,
      deployments: 6,
      deploymentConfigs: 0,
      statefulSets: 0,
      pods: 16,
      podCounters: {
        totalPods: 29,
        runningPods: 4
      },
      deploymentCounters: {
        totalDeployments: 6,
        criticalDeployments: 0,
        warningDeployments: 0
      }
    },
    cronJobs: 0,
    entityHealthInfo: {
      maxSeverity: 0,
      openIssues: []
    },
    name: 'FG-cluster'
  },
  {
    id: 'd511d046-e5e8-460b-bb1b-422ce38dc6ad',
    cluster: {
      id: 'TTKe7-yDUXpTMha5rqU25Hrbs04',
      clusterDistribution: 'gke',
      clusterManagedBy: 'none',
      clusterManagement: {
        shortName: 'none',
        fullName: 'none'
      },
      label: 'demo-us-cluster',
      version: 'v1.30.8-gke.1261000',
      componentStatuses: [],
      debuggingInfo: {
        Leader: 'k8sensor-test-5c6bff4dc-2c4xf',
        'Missing Resource Watches': 'None',
        UUID: 'd511d046-e5e8-460b-bb1b-422ce38dc6ad'
      },
      missingAppsPermissions: false
    },
    namespaces: 16,
    nodes: 3,
    nodeCounters: {
      totalNodes: 3,
      criticalNodes: 0,
      warningNodes: 0
    },
    services: 100,
    persistentVolumes: 6,
    workloads: {
      daemonSets: 16,
      deployments: 44,
      deploymentConfigs: 0,
      statefulSets: 1,
      pods: 77,
      podCounters: {
        totalPods: 77,
        runningPods: 2
      },
      deploymentCounters: {
        totalDeployments: 44,
        criticalDeployments: 0,
        warningDeployments: 0
      }
    },
    cronJobs: 1,
    entityHealthInfo: {
      maxSeverity: 0,
      openIssues: []
    },
    name: 'demo-us-cluster'
  }
];

const itemsAdditionalInfo = {
  '27iqVZWmdP9us6cDHn67msnY_OQ': {
    totalRunningPods: 14,
    totalUnhealthyNodes: 1,
    hasNodesWithOnlyWarnings: true,
    totalUnhealthyDeployments: 0,
    hasDeploymentsWithOnlyWarnings: false
  },
  'TTKe7-yDUXpTMha5rqU25Hrbs04': {
    totalRunningPods: 75,
    totalUnhealthyNodes: 0,
    hasNodesWithOnlyWarnings: false,
    totalUnhealthyDeployments: 2,
    hasDeploymentsWithOnlyWarnings: false
  },
  TI9PQ9XPuMK4I_4HMT_NzQ5Bobs: {
    totalRunningPods: 210,
    totalUnhealthyNodes: 0,
    hasNodesWithOnlyWarnings: false,
    totalUnhealthyDeployments: 1,
    hasDeploymentsWithOnlyWarnings: false
  }
};

describe('sortBy', () => {
  describe('sortBy - name', () => {
    it('sort items by name - ASC', () => {
      const expectedLabels = items.map(item => item.cluster.label);
      const result = [...items].sort(sortBy({ orderBy: 'name', orderDirection: 'ASC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedLabels);
    });

    it('sort items by name - DESC', () => {
      const expectedLabels = items.map(item => item.cluster.label).reverse();
      const result = [...items].sort(sortBy({ orderBy: 'name', orderDirection: 'DESC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedLabels);
    });
  });

  describe('sortBy - namespaces', () => {
    const expectedAsc = ['FG-cluster', 'demo-us-cluster', 'FG-OCP-cluster'];
    const expectedDesc = [...expectedAsc].reverse();

    it('sort by namespaces - ASC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'namespaces', orderDirection: 'ASC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedAsc);
    });

    it('sort by namespaces - DESC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'namespaces', orderDirection: 'DESC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedDesc);
    });
  });

  describe('sortBy - services', () => {
    const expectedAsc = ['FG-cluster', 'FG-OCP-cluster', 'demo-us-cluster'];
    const expectedDesc = [...expectedAsc].reverse();

    it('should sort by services - ASC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'services', orderDirection: 'ASC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedAsc);
    });

    it('should sort by services - DESC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'services', orderDirection: 'DESC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedDesc);
    });
  });

  describe('sortBy - cronJobs', () => {
    const expectedAsc = ['FG-cluster', 'demo-us-cluster', 'FG-OCP-cluster'];
    const expectedDesc = [...expectedAsc].reverse();

    it('sort by cronJobs - ASC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'cronJobs', orderDirection: 'ASC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedAsc);
    });

    it('sort by cronJobs - DESC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'cronJobs', orderDirection: 'DESC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedDesc);
    });
  });

  describe('sortBy - runningPods', () => {
    const expectedAsc = ['FG-cluster', 'demo-us-cluster', 'FG-OCP-cluster'];
    const expectedDesc = [...expectedAsc].reverse();

    it('sort by runningPods - ASC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'runningPods', orderDirection: 'ASC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedAsc);
    });

    it('sort by runningPods - DESC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'runningPods', orderDirection: 'DESC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedDesc);
    });
  });

  describe('sortBy - unhealthyNodes', () => {
    const expectedAsc = ['FG-OCP-cluster', 'demo-us-cluster', 'FG-cluster'];
    const expectedDesc = ['FG-cluster', 'FG-OCP-cluster', 'demo-us-cluster'];

    it('sort by unhealthyNodes - ASC', () => {
      const result = [...items].sort(sortBy({ orderBy: 'unhealthyNodes', orderDirection: 'ASC', itemsAdditionalInfo }));
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedAsc);
    });

    it('sort by unhealthyNodes - DESC', () => {
      const result = [...items].sort(
        sortBy({ orderBy: 'unhealthyNodes', orderDirection: 'DESC', itemsAdditionalInfo })
      );
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedDesc);
    });
  });

  describe('sortBy - unhealthyDeployments', () => {
    const expectedAsc = ['FG-cluster', 'FG-OCP-cluster', 'demo-us-cluster'];
    const expectedDesc = ['demo-us-cluster', 'FG-OCP-cluster', 'FG-cluster'];

    it('sort by unhealthyDeployments - ASC', () => {
      const result = [...items].sort(
        sortBy({ orderBy: 'unhealthyDeployments', orderDirection: 'ASC', itemsAdditionalInfo })
      );
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedAsc);
    });

    it('sort by unhealthyDeployments - DESC', () => {
      const result = [...items].sort(
        sortBy({ orderBy: 'unhealthyDeployments', orderDirection: 'DESC', itemsAdditionalInfo })
      );
      const resultLabels = result.map(item => item.cluster.label);
      expect(resultLabels).toStrictEqual(expectedDesc);
    });
  });
});
