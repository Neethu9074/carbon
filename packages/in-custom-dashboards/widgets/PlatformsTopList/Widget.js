import { combineLatest } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import { getCloudfoundryApplicationsWithDefaults } from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
import { getKubernetesClustersWithDefaults } from 'in-subscription/kubernetes/getKubernetesClusters';
import { getVSphereDatacentersWithDefaults } from 'in-vsphere/subscriptions/getVsphereDatacenters';
import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import mergeResults from 'in-custom-dashboards/widgets/TopListWidget/mergeResults';
import getKubernetesCluster from 'in-subscription/kubernetes/getKubernetesCluster';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import { hasError, isLoading } from 'in-services/util/result';
import { getResultForData } from 'in-services/util/result';
import KeyValue from 'in-new-components/lists/KeyValue';
import { toTitleCase } from 'in-services/util/string';
import WithIcon from 'in-new-components/WithIcon';

export default function PlatformsTopList(props) {
  return (
    <TopListWidget
      {...props}
      icon="lib_platforms_inverted"
      getItems={getMergedData}
      getItemsByGroupedIds={getItemsByGroupedIds}
      pinnedItemTypes={[types.KUBERNETES_CLUSTERS, types.PCF_APPLICATIONS, types.VSPHERE_DATACENTERS]}
      getId={item => (item.isKubernetes ? item.cluster.id : item.id)}
      pinItem={(id, item) => pin(getTypeByItem(item), id)}
      unpinItem={(id, item) => unpin(getTypeByItem(item), id)}
      columnDefinitions={columnDefinitions}
    />
  );
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
    getCloudfoundryApplicationsWithDefaults(params),
    'isPcf',
    getKubernetesClustersWithDefaults(params),
    'isKubernetes',
    getVSphereDatacentersWithDefaults(params),
    'isVsphere'
  )();
}

function getItemsByGroupedIds(groupedIds, timeConfig) {
  const kubernetesIds = groupedIds[types.KUBERNETES_CLUSTERS] || [];
  const vSphereIds = groupedIds[types.VSPHERE_DATACENTERS] || [];
  const pcfIds = groupedIds[types.PCF_APPLICATIONS] || [];

  return combineLatest([
    ...kubernetesIds.map(id => getKubernetesCluster({ id, timeConfig }).map(mapKubernetesClusterResult)),
    ...vSphereIds.map(id => getVsphereDatacenter({ datacenterId: id, timeConfig }).map(mapVsphereResult)),
    ...pcfIds.map(id => getCloudfoundryApplication({ filter: { applicationId: id, timeConfig } }).map(mapPcfResult))
  ]).map(results => {
    for (let i = 0; i < results.length; i++) {
      if (isLoading(results[i]) || hasError(results[i])) {
        return results[i];
      }
    }

    return getResultForData({
      items: results.map(result => result.data)
    });
  });
}

function mapKubernetesClusterResult(result) {
  return result.data ? getResultForData({ cluster: result.data, isKubernetes: true }) : result;
}

function mapVsphereResult(result) {
  return result.data ? getResultForData({ ...result.data, isVsphere: true }) : result;
}

function mapPcfResult(result) {
  return result.data ? getResultForData({ ...result.data, isPcf: true }) : result;
}

const columnDefinitions = [
  {
    id: 'health',
    label: 'Health',
    width: 5,
    getContent(item) {
      return <HealthDot severity={get(item, ['entityHealthInfo', 'maxSeverity', 0, 1], 0)} iconSize={10} />;
    }
  },
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return (
        <WithIcon icon={getIcon(item)}>
          <KeyValue label={getSubTitle(item)} value={getLabel(item)} inverted accentuated />
        </WithIcon>
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
