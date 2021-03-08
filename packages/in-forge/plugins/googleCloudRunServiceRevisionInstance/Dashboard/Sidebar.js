/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Info from 'in-forge/plugins/googleCloudRunServiceRevisionInstance/Info';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';

export default function GoogleCloudRunServiceRevisionInstanceSidebar({ snapshot }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.googleCloudRunServiceRevisionInstance.dashboard.cloudRunInstanceInfo')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </>
  );
}
