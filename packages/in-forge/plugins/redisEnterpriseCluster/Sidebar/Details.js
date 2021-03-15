/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ClusterNodeMemberList from 'in-forge/plugins/redisEnterpriseCluster/Sidebar/ClusterNodeMemberList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Info from 'in-forge/plugins/redisEnterpriseCluster/Info.js';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';

export default function RedisClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.redisEnterpriseCluster.redisEnterpriseCluster')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ClusterNodeMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
