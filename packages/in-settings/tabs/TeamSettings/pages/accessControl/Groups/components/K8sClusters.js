import React from 'react';

import SelectableItemList from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/SelectableItemList';
import { getKubernetesClustersAsResultObservable } from 'in-settings/tabs/TeamSettings/api/kubernetesClusters';
import createApiList from 'in-settings/components/ApiList';

const List = createApiList({
  getItems: getKubernetesClustersAsResultObservable,
  pageSize: 5,
  searchFields: ['label'],
  orderBy: 'label',
  boundedPath: '/clusters'
});

export default function Selectable(props) {
  return (
    <SelectableItemList
      List={List}
      {...props}
      toggleItem={k8sCluster => props.toggleItem(k8sCluster.id, { k8sCluster })}
    />
  );
}
