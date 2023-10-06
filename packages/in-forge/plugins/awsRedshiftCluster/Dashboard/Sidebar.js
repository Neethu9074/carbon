/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsRedshiftCluster/Info';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';

export default function AwsRedshiftClusterSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.awsRedshiftCluster.dashboard.redshiftClusterInfo')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />
      <ClusterMemberList snapshotId={snapshotId} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
