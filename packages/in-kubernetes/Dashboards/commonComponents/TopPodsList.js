/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { Link } from '@instana/components';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesPods from 'in-kubernetes/subscriptions/getKubernetesPods';
import { trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { usePodDashboard } from 'in-kubernetes/navigation/paths';
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
      Label={item => <Label {...item} {...props} />}
      allItemsHref={props.allItemsHref}
      getItemLabel={item => item.pod.label}
      Metric={Phase}
    />
  );
}

function Phase(props) {
  return get(props, ['item', 'pod', 'status', 'phase']);
}

function Label({ item, getItemLabel, className, namespaceId, clusterId }) {
  const href = usePodDashboard(item.pod.id, {
    clusterId,
    namespaceId
  });

  return (
    <Link className={className} href={href} onClick={() => trackTopListNavigation()}>
      {getItemLabel(item)}
    </Link>
  );
}
