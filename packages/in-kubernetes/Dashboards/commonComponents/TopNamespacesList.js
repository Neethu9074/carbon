/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesNamespaces from 'in-kubernetes/subscriptions/getKubernetesNamespaces';
import { trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { useNamespaceDashboard } from 'in-kubernetes/navigation/paths';
import { t } from 'in-i18n';

export default function TopNamespacesList(props) {
  return (
    <KubernetesTopList
      title={t('in-kubernetes:dashboards.topNamespaces')}
      entityNameKey="namespace"
      {...props}
      Label={item => <Label {...item} />}
      getItems={getKubernetesNamespaces}
      allItemsHref={props.allItemsHref}
      getItemLabel={item => item.namespace.label}
    />
  );
}

function Label({ item, getItemLabel, className, timeConfig, clusterId }) {
  const href = useNamespaceDashboard(item.namespace.id, { timeConfig, clusterId });

  return (
    <Link className={className} href={href} onClick={() => trackTopListNavigation()}>
      {getItemLabel(item)}
    </Link>
  );
}
