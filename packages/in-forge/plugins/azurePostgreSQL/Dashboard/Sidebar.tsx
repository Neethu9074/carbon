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
import Info from 'in-forge/plugins/azurePostgreSQL/Info';
import { t } from 'in-i18n';

export default function AzurePostgreSQLSidebarDetails({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.azurePostgreSQL.infoAzurePostgreSQL')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />
      <RemoteServiceAgentCorrelationComponent snapshot={snapshot} />
    </>
  );
}
