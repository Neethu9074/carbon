/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getVersionsForLambdaFunction from 'in-subscription/getVersionsForLambdaFunction';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SidebarSnapshotItemList from 'in-components/SidebarSnapshotItemList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/awsLambdaFunction/Info';
import { fullyQualifiedPlugins } from 'in-forge/constants';
import TagList from 'in-sdk/components/sidebar/TagList';

export default function AwsLambdaFunctionSidebar({ snapshot }) {
  const latestVersionForFunction = snapshot.update('entityId', entityId =>
    entityId
      .set('pluginId', fullyQualifiedPlugins.awsLambdaVersion)
      .update('steadyId', unqualifiedArn => `${unqualifiedArn}:$LATEST`)
  );
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsLambdaFunction.headerLambdaFunctionInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <SidebarSnapshotItemList
        snapshotId={snapshot.get('id')}
        subscription={getVersionsForLambdaFunction}
        label={t('in-forge:plugins.awsLambdaFunction.labelVersions')}
      />
      <ServiceInstancesList
        snapshot={latestVersionForFunction}
        header={t('in-forge:plugins.awsLambdaFunction.headerServicesLATEST')}
      />
    </div>
  );
}
