/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesNamespaces from 'in-subscription/kubernetes/getKubernetesNamespaces';
import { getNamespaceDashboard } from 'in-kubernetes/navigation/paths';

export default function TopNamespacesList(props) {
  return (
    <KubernetesTopList
      title={t('in-kubernetes:dashboards.topNamespaces')}
      entityNameKey="namespace"
      {...props}
      getItems={getKubernetesNamespaces}
      getItemHref$={item => getNamespaceDashboard(item.namespace.id, props)}
      allItemsHref$={props.allItemsHref$}
      getItemLabel={item => item.namespace.label}
    />
  );
}
