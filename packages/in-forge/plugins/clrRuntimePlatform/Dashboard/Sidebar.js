/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/clrRuntimePlatform/Info';
import { t } from 'in-i18n';

export default function ClrRuntimeSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.clrRuntimePlatform.netClr')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshotId} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
