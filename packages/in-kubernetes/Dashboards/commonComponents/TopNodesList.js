/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesNodes from 'in-subscription/kubernetes/getKubernetesNodes';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';

export default function TopNodesList(props) {
  return (
    <KubernetesTopList
      title={t('in-kubernetes:dashboards.topNodes')}
      entityNameKey="node"
      {...props}
      getItems={getKubernetesNodes}
      getItemHref$={item => getNodeDashboard(item.node.id, props)}
      allItemsHref$={props.allItemsHref$}
      getItemLabel={item => item.node.name}
    />
  );
}
