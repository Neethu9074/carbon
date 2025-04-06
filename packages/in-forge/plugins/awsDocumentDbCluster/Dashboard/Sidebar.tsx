/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RemoteServiceAgentCorrelationComponent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationComponent';
// @ts-expect-error Module needs to be translated to TS
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
// @ts-expect-error Module needs to be translated to TS
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
// @ts-expect-error Module needs to be translated to TS
import TagList from 'in-sdk/components/sidebar/TagList';
import Info from 'in-forge/plugins/awsDocumentDbCluster/Info';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function awsDocumentDbClusterSidebar({ snapshot }: { snapshot: SnapshotData }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.awsDocumentDbCluster.dashboard.documentdbClusterInfo')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <ClusterMemberList snapshotId={snapshotId} />
      <ServiceInstancesList snapshot={snapshot} />

      <RemoteServiceAgentCorrelationComponent snapshot={snapshot} />
    </>
  );
}
