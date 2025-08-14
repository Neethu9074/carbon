/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

import { Collapsible } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
// @ts-expect-error Module needs to be translated to TS
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Info from 'in-forge/plugins/oTelMilvusDB/Info';
import { t } from 'in-i18n';

interface OTelMilvusDBSidebarProps {
  snapshot: SnapshotData;
}

export default function OTelMilvusDBSidebar({ snapshot }: OTelMilvusDBSidebarProps): JSX.Element {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.oTelMilvusDB.oTelMilvusDB')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
