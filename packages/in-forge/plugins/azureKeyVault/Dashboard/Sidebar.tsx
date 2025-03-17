/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RemoteServiceAgentCorrelationComponent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationComponent';
// @ts-expect-error Module needs to be translated to TS
import TagList from 'in-sdk/components/sidebar/TagList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';
import Info from '../info';

export default function azureKeyVaultSidebarDetails({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.azureKeyVault.infoKeyVault')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />
      <RemoteServiceAgentCorrelationComponent snapshot={snapshot} />
    </div>
  );
}
