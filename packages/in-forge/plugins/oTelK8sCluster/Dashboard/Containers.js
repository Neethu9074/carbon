/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';
import { Collapsible, Link } from '@instana/components';

import { ClickableList, ClickableListItem } from 'in-sdk/components/sidebar/ClickableList';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

export default function Containers({ containers, renderByDashboard }) {
  const getDashboardLink = useGetDashboardLink();

  const carbonHeaders = [
    {
      key: 'name',
      header: t('in-forge:plugins.oTelK8sCluster.dashboard.name')
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
  const carbonRows = containers.map(container => ({
    id: container.id,
    name: (
      <Link href={getDashboardLink(container.id, { pathname: '/physical/dashboard' })}>
        {container.resourceK8sContainerName}
      </Link>
    ),
    namespace: container.resourceK8sNamespaceName,
    age: formatDurationAccurately(new Date() - new Date(container.resourceK8sContainerName)) ?? '-',
    status: 'Ready',
    health: <HealthIndicatorPresenter openIssues={0} maxSeverity={1} tooltipLabel={'issue'} />
  }));

  if (renderByDashboard) {
    return <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} isExpanded={false} />;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{'ContainerList'}</Collapsible.Header>
        <Collapsible.Content>
          <ClickableList>
            {containers.map(item => (
              <ClickableListItem key={item} href={getDashboardLink(item.id, { pathname: '/physical/dashboard' })}>
                {item.resourceK8sContainerName}
              </ClickableListItem>
            ))}
          </ClickableList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
