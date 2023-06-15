/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import KubernetesTopList from 'in-kubernetes/Dashboards/commonComponents/KubernetesTopList';
import getKubernetesNodes from 'in-kubernetes/subscriptions/getKubernetesNodes';
import { trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { useNodeDashboard } from 'in-kubernetes/navigation/paths';
import { t } from 'in-i18n';

export default function TopNodesList(props) {
  return (
    <KubernetesTopList
      title={t('in-kubernetes:dashboards.topNodes')}
      entityNameKey="node"
      {...props}
      getItems={getKubernetesNodes}
      Label={item => <Label {...item} />}
      allItemsHref={props.allItemsHref}
      getItemLabel={item => item.node.name}
    />
  );
}

function Label({ item, getItemLabel, className, timeConfig, clusterId }) {
  const href = useNodeDashboard(item.node.id, { timeConfig, clusterId });

  return (
    <Link className={className} href={href} onClick={() => trackTopListNavigation()}>
      {getItemLabel(item)}
    </Link>
  );
}
