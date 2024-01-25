/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import TagList from 'in-sdk/components/sidebar/TagList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Info from 'in-forge/plugins/azureServiceBus/Info';
import { t } from 'in-i18n';

export default function AzureServiceBusSidebarDetails({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.azureServiceBus.infoAzureServiceBus')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />
    </div>
  );
}
