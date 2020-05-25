import React from 'react';

import SelectableItemList from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/SelectableItemList';
import { getKubernetesNamespacesAsResultObservable } from 'in-settings/tabs/TeamSettings/api/kubernetesNamespaces';
import createApiList from 'in-settings/components/ApiList';

const List = createApiList({
  getItems: getKubernetesNamespacesAsResultObservable,
  pageSize: 5,
  searchFields: ['label'],
  orderBy: 'label',
  boundedPath: '/namespaces'
});

export default function Selectable(props) {
  return (
    <SelectableItemList
      List={List}
      {...props}
      toggleItem={k8sNamespace => props.toggleItem(k8sNamespace.id, { k8sNamespace })}
    />
  );
}
