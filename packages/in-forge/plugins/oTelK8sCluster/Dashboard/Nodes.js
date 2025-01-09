/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/legacy';
import { Collapsible, Link } from '@instana/components';

import { ClickableList, ClickableListItem } from 'in-sdk/components/sidebar/ClickableList';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

export default function Nodes({ nodes, renderByDashboard }) {
  const getDashboardLink = useGetDashboardLink();
  if (renderByDashboard) {
    return (
      <Table tableInCard>
        <Thead>
          <Tr size="compact">
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.name')}</Th>
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.age')}</Th>
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.status')}</Th>
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.health')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {nodes.map(node => (
            <Tr key={node.id} size="compact">
              <Td>
                <Link href={getDashboardLink(node.id, { pathname: '/physical/dashboard' })}>
                  {node.resourceK8sNodeName}
                </Link>
              </Td>
              <Td>-</Td>
              <Td>Ready</Td>
              <Td>
                <HealthIndicatorPresenter openIssues={0} maxSeverity={1} tooltipLabel={'issue'} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
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
