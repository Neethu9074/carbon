import { get } from 'lodash';
import React from 'react';

import { getCloudfoundryApplicationsWithDefaults } from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
import { getKubernetesClustersWithDefaults } from 'in-subscription/kubernetes/getKubernetesClusters';
import { getVSphereDatacentersWithDefaults } from 'in-vsphere/subscriptions/getVsphereDatacenters';
import mergeResults from 'in-custom-dashboards/widgets/TopListWidget/mergeResults';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import KeyValue from 'in-new-components/lists/KeyValue';
import { toTitleCase } from 'in-services/util/string';
import WithIcon from 'in-new-components/WithIcon';

export default function PlatformsTopList(props) {
  return (
    <TopListWidget
      {...props}
      icon="lib_platforms_inverted"
      getItems={getMergedData}
      pinnedItemTypes={[types.KUBERNETES_CLUSTERS, types.PCF_APPLICATIONS, types.VSPHERE_DATACENTERS]}
      getId={item => item.id}
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
