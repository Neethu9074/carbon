/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getTriggersForLambdaVersion from 'in-subscription/getTriggersForLambdaVersion';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsLambdaVersion/Info';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';

export default function AwsLambdaVersionSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsLambdaVersion.headerLambdaVersionInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <SidebarSnapshotItemList
        snapshotId={snapshotId}
        subscription={getTriggersForLambdaVersion}
        label={t('in-forge:plugins.awsLambdaVersion.labelTriggers')}
      />

      <KeyValueOverlay
        header={t('in-forge:plugins.awsLambdaVersion.headerRuntimeVersions')}
        data={snapshot.getIn(['data', 'versions'])}
      />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
