/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';
import Info from '../Info';

export default function CassandraClusterSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const liveNodesCount = data.get('nodeCount');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.cassandraCluster.cassandraCluster')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible>
        <Collapsible.Header>{t('in-forge:plugins.cassandraCluster.nodes')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.cassandraCluster.dashboard.labelAvailableNodes')}>
              {liveNodesCount}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.cassandraCluster.dashboard.labelUnreachableNodes')}>
              {unreachableNodesCount(data)}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}

function unreachableNodesCount(data) {
  const unreachableNodes = data.get('unreachableNodes');
  if (unreachableNodes) {
    return unreachableNodes.size;
  } else {
    return null;
  }
}
