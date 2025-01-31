/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';
import { Collapsible, Link } from '@instana/components';

import { ClickableList, ClickableListItem } from 'in-sdk/components/sidebar/ClickableList';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

export default function Nodes({ nodes, renderByDashboard }) {
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
  const carbonRows = nodes.map(node => ({
    name: <Link href={getDashboardLink(node.id, { pathname: '/physical/dashboard' })}>{node.resourceK8sNodeName}</Link>,
    age: '-',
    status: 'Ready',
    health: <HealthIndicatorPresenter openIssues={0} maxSeverity={1} tooltipLabel={'issue'} />
  }));

  const getDashboardLink = useGetDashboardLink();
  if (renderByDashboard) {
    return <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} isExpanded={false} />;
  }
  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>{'NodeList'}</Collapsible.Header>
        <Collapsible.Content>
          <ClickableList>
            {nodes.map(item => (
              <ClickableListItem key={item} href={getDashboardLink(item.id, { pathname: '/physical/dashboard' })}>
                {item.resourceK8sNodeName}
              </ClickableListItem>
            ))}
          </ClickableList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
