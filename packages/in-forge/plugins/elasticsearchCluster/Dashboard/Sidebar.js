/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';

import Info from '../Info';

export default function ElasticsearchClusterSidebar({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.elasticsearchCluster.dashboard.elasticsearchCluster')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <Collapsible>
        <Collapsible.Header>{t('in-forge:plugins.elasticsearchCluster.dashboard.nodes')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.elasticsearchCluster.dashboard.nodes')}>
              {data.get('nodeCount')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.elasticsearchCluster.dashboard.dataNodes')}>
              {data.get('dataNodeCount')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.elasticsearchCluster.dashboard.masterNodes')}>
              {data.get('masterNodeCount')}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
