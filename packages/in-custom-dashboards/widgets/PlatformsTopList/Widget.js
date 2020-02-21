import React from 'react';

import { getCloudfoundryApplicationsWithDefaults } from 'in-cloudfoundry/subscriptions/getCloudfoundryApplications';
import { getKubernetesClustersWithDefaults } from 'in-subscription/kubernetes/getKubernetesClusters';
import { getVSphereDatacentersWithDefaults } from 'in-vsphere/subscriptions/getVsphereDatacenters';
import mergeResults from 'in-custom-dashboards/widgets/TopListWidget/mergeResults';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';

export default function PlatformsTopList(props) {
  return (
    <TopListWidget
      {...props}
      icon="lib_platforms_inverted"
      getItems={getMergedData}
      pinnedItemTypes={[types.APPLCATIONS]}
      getId={getId}
      pinItem={(id, item) => pin(getTypeByItem(item), id)}
      unpinItem={(id, item) => unpin(getTypeByItem(item), id)}
      columnDefinitions={columnDefinitions}
    />
  );
}

function getId(item) {
  return item.id;
}
function getTypeByItem(item) {
  return item.website ? types.WEBSITES : types.MOBILE_APPS;
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      if (item.isKubernetes) {
        return item.cluster.label;
      }
      return item.label;
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
