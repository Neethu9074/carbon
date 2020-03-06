import { combineLatest } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import { getCloudfoundryApplicationsWithDefaults } from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
import getKubernetesClusterItemCounters from 'in-subscription/kubernetes/getKubernetesClusterItemCounters';
import { getKubernetesClustersWithDefaults } from 'in-subscription/kubernetes/getKubernetesClusters';
import { getVSphereDatacentersWithDefaults } from 'in-vsphere/subscriptions/getVsphereDatacenters';
import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import mergeResults from 'in-custom-dashboards/widgets/TopListWidget/mergeResults';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import { bytesZeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import InstanceMetric from 'in-cloudfoundry/commonComponents/InstanceMetric';
import { getVsphereDatacenterDashboard } from 'in-vsphere/navigation/paths';
import { getApplicationDashboard } from 'in-cloudfoundry/navigation/paths';
import { toTitleCase, compareIgnoreCase } from 'in-services/util/string';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import { pcfEnabled, vsphereEnabled } from 'in-services/featureFlags';
import { getClusterDashboard } from 'in-kubernetes/navigation/paths';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import { hasError, isLoading } from 'in-services/util/result';
import { hasKubernetesAccess } from 'in-stores/permission';
import { getResultForData } from 'in-services/util/result';
import KeyValue from 'in-new-components/lists/KeyValue';
import { getMetric } from 'in-stores/metric';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

export default function PlatformsTopList({ config }) {
  const pinnedTypes = [
    hasKubernetesAccess && types.KUBERNETES_CLUSTERS,
    pcfEnabled && types.PCF_APPLICATIONS,
    vsphereEnabled && types.VSPHERE_DATACENTERS
  ].filter(Boolean);

  return (
    <TopListWidget
      {...config}
      getItems={getMergedData}
      getItem={getItem}
      pinnedItemTypes={pinnedTypes}
      getId={getId}
      pinItem={(id, item) => pin(getTypeByItem(item), id)}
      unpinItem={(id, item) => unpin(getTypeByItem(item), id)}
      columnDefinitions={columnDefinitions}
      getItemLink={item => {
        return (item.isKubernetes
          ? getClusterDashboard
          : item.isPcf
            ? getApplicationDashboard
            : getVsphereDatacenterDashboard)(getId(item));
      }}
    />
  );
}

function getId(item) {
  return item.isKubernetes ? item.cluster.id : item.id;
}

function getTypeByItem(item) {
  if (item.isKubernetes) {
    return types.KUBERNETES_CLUSTERS;
  }
  if (item.isPcf) {
    return types.PCF_APPLICATIONS;
  }
  return types.VSPHERE_DATACENTERS;
}

function getMergedData(params) {
  return mergeResults(
    [
      hasKubernetesAccess && getKubernetesClustersWithDefaults(params),
      hasKubernetesAccess && 'isKubernetes',
      pcfEnabled && getCloudfoundryApplicationsWithDefaults(params),
      pcfEnabled && 'isPcf',
      vsphereEnabled && getVSphereDatacentersWithDefaults(params),
      vsphereEnabled && 'isVsphere'
    ].filter(Boolean)
  )((a, b) => compareIgnoreCase(getLabel(a), getLabel(b)));
}

function getItem(id, timeConfig, type) {
  if (type === types.KUBERNETES_CLUSTERS) {
    return getKubernetesClusterById(id, timeConfig);
  }
  if (type === types.PCF_APPLICATIONS) {
    return getCloudfoundryApplication({ filter: { applicationId: id, timeConfig } }).map(mapPcfResult);
  }
  return getVsphereDatacenter({ datacenterId: id, timeConfig }).map(mapVsphereResult);
}

function getKubernetesClusterById(id, timeConfig) {
  return combineLatest([
    getKubernetesCluster({ id, timeConfig }),
    getKubernetesClusterItemCounters({ clusterId: id, timeConfig })
  ]).map(([kubernetesClusterResult, itemCounterResult]) => {
    if (isLoading(kubernetesClusterResult) || hasError(kubernetesClusterResult)) {
      return kubernetesClusterResult;
    }
    if (isLoading(itemCounterResult) || hasError(itemCounterResult)) {
      return itemCounterResult;
    }
    return getResultForData({ cluster: kubernetesClusterResult.data, ...itemCounterResult.data, isKubernetes: true });
  });
}

function mapVsphereResult(result) {
  return result.data ? getResultForData({ ...result.data, isVsphere: true }) : result;
}

function mapPcfResult(result) {
  return result.data ? getResultForData({ ...result.data, isPcf: true }) : result;
}

const columnDefinitions = [
  {
    width: '2rem',
    getContent(item) {
      return <HealthDot severity={get(item, ['entityHealthInfo', 'maxSeverity', 0, 1], 0)} iconSize={10} />;
    }
  },
  {
    width: '3rem',
    getContent(item) {
      return <SvgIcon type={getIcon(item)} />;
    }
  },
  {
    getContent(item) {
      return <KeyValue label={getSubTitle(item)} value={getLabel(item)} inverted accentuated />;
    }
  },
  {
    width: '6rem',
    getContent(item) {
      if (item.isPcf || item.isKubernetes) {
        return null;
      }
      return <KeyValue label="ESXi Hosts" value={item.hosts} accentuated />;
    }
  },
  {
    width: '6rem',
    getContent(item) {
      if (item.isPcf) {
        return null;
      }
      return item.isKubernetes ? (
        <KeyValue label="Nodes" value={item.nodes} accentuated />
      ) : (
        <KeyValue label="VMs" value={item.vms} accentuated />
      );
    }
  },
  {
    width: '12rem',
    getContent(item) {
      if (item.isPcf) {
        return <KeyValue label="Instances" value={<InstanceMetric applicationId={item.id} />} accentuated />;
      }
      return item.isKubernetes ? (
        <KeyValue label="Namespaces" value={item.namespaces} accentuated />
      ) : (
        <SparkChartWithMetricValue
          snapshotId={item.id}
          formatter={percentage.compact}
          metric="cpu.usage.percent.maximum.*"
          label="CPU Usage"
          aggregation="mean"
        />
      );
    }
  },
  {
    width: '12rem',
    getContent(item) {
      if (item.isPcf) {
        return <KeyValue label="Memory Limit" value={bytesZeroDecimalPlaces(item.memoryLimit)} accentuated />;
      }
      return item.isKubernetes ? (
        <KeyValue label="Pods" value={item.pods} accentuated />
      ) : (
        <SparkChartWithMetricValue
          snapshotId={item.id}
          formatter={percentage.compact}
          metric="mem.usage.average.percent"
          label="Memory Usage"
          aggregation="mean"
        />
      );
    }
  }
];

function getIcon(item) {
  if (item.isKubernetes) {
    const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
    return `lib_${clusterDistribution}`;
  }
  if (item.isPcf) {
    return 'lib_cloudfoundry_application';
  }
  return 'lib_vsphere_cluster';
}

function getLabel(item) {
  return item.isKubernetes ? item.cluster.label : item.label;
}

function getSubTitle(item) {
  if (item.isKubernetes) {
    const clusterDistribution = get(item, ['cluster', 'clusterDistribution'], 'kubernetes');
    return `${toTitleCase(clusterDistribution)} Cluster, ${item.nodes} Node${item.nodes > 1 ? 's' : ''}, ${
      item.pods
    } Pod${item.pods > 1 ? 's' : ''}`;
  }
  if (item.isPcf) {
    return 'Cloud Foundry Application';
  }
  return 'vSphere Cluster';
}

const SparkChartWithMetricValue = connectTo(
  ({ snapshotId, metric, aggregation }) => ({
    horizontalMetricValue: getMetric({
      snapshotId,
      metric,
      timeWindowAggregation: aggregation,
      forceTimeWindowAggregation: true
    })
  }),
  function SparkChartWithMetricValue(props) {
    return <HistoricMetricSparkChart {...props} width={72} />;
  }
);
