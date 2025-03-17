/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';
import { Collapsible, Link } from '@instana/components';

import { ClickableList, ClickableListItem } from 'in-sdk/components/sidebar/ClickableList';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

export default function Pods({ pods, renderByDashboard }) {
  const carbonHeaders = [
    {
      key: 'name',
      header: t('in-forge:plugins.oTelK8sCluster.dashboard.name')
    },
    {
      key: 'namespace',
      header: t('in-forge:plugins.oTelK8sCluster.dashboard.namespace')
    },
    {
      key: 'age',
      header: t('in-forge:plugins.oTelK8sCluster.dashboard.age')
    },
    {
      key: 'status',
      header: t('in-forge:plugins.oTelK8sCluster.dashboard.status')
    },
    {
      key: 'health',
      header: t('in-forge:plugins.oTelK8sCluster.dashboard.health')
    }
  ];

  const getDashboardLink = useGetDashboardLink();

  const carbonRows = pods.map(pod => ({
    id: pod.id,
    name: <Link href={getDashboardLink(pod.id, { pathname: '/physical/dashboard' })}>{pod.resourceK8sPodName}</Link>,
    namespace: pod.resourceK8sNamespaceName,
    age: formatDurationAccurately(new Date() - new Date(pod.resourceK8sPodStart_time)),
    status: 'Ready',
    health: <HealthIndicatorPresenter openIssues={0} maxSeverity={1} tooltipLabel={'issue'} />
  }));

  if (renderByDashboard) {
    return <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} isExpanded={false} />;
  }
  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{'PodList'}</Collapsible.Header>
        <Collapsible.Content>
          <ClickableList>
            {pods.map(item => (
              <ClickableListItem key={item} href={getDashboardLink(item.id, { pathname: '/physical/dashboard' })}>
                {item.resourceK8sPodName}
              </ClickableListItem>
            ))}
          </ClickableList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
