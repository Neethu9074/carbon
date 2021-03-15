/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';
import Info from '../Info';

export default function ReplicaSetSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const clusterName = data.get('clusterName');
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.mongoDbReplicaSet.mongoDbReplicaSet')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {clusterName ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{t('in-forge:plugins.mongoDbReplicaSet.atlasCluster')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.name')}>
                {data.get('clusterName')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.type')}>
                {data.get('clusterType')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.cloudProvider')}>
                {data.get('clusterProvider')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.region')}>
                {data.get('clusterRegion')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.project')}>
                {data.get('clusterProjectName')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDbReplicaSet.organisation')}>
                {data.get('clusterOrganisationName')}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />

      <ClusterMemberList snapshotId={snapshot.get('id')} />
    </div>
  );
}
