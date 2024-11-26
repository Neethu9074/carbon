/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/legacy';
import { Collapsible, Link } from '@instana/components';

import { ClickableList, ClickableListItem } from 'in-sdk/components/sidebar/ClickableList';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { formatDurationAccurately } from 'in-kubernetes/components/TimeFormatter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { t } from 'in-i18n';

export default function Pods({ pods, renderByDashboard }) {
  const getDashboardLink = useGetDashboardLink();
  if (renderByDashboard) {
    return (
      <Table tableInCard>
        <Thead>
          <Tr size="compact">
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.name')}</Th>
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.namespace')}</Th>
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.age')}</Th>
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.status')}</Th>
            <Th>{t('in-forge:plugins.oTelK8sCluster.dashboard.health')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pods.map(pod => (
            <Tr key={pod.id} size="compact">
              <Td>
                <Link href={getDashboardLink(pod.id, { pathname: '/physical/dashboard' })}>
                  {pod.resourceK8sPodName}
                </Link>
              </Td>
              <Td>{pod.resourceK8sNamespaceName}</Td>
              <Td>{formatDurationAccurately(new Date() - new Date(pod.resourceK8sPodStart_time))}</Td>
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
