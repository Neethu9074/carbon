/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import { t } from 'in-i18n';

export default function TopPodsList(props) {
  return (
    <KubernetesTopList
      title={t('in-kubernetes:dashboards.topPods')}
      entityNameKey="pod"
      {...props}
      metrics={['status']}
      metricOrderDirection="ASC"
      labels={[t('in-kubernetes:dashboards.status')]}
      getItems={getKubernetesPods}
      getItemHref$={item =>
        getPodDashboard(item.pod.id, {
          clusterId: props.clusterId,
          namespaceId: props.namespaceId
        })
      }
      allItemsHref$={props.allItemsHref$}
      getItemLabel={item => item.pod.label}
      renderMetric={props => get(props.item.pod, ['status', 'phase'])}
    />
  );
}
