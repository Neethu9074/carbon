/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Info from 'in-forge/plugins/awsIotCore/Info';
import { t } from 'in-i18n';

export default function AwsAppSyncSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsIotCore.headerIotCoreInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ServiceInstancesList snapshot={snapshot} />
    </>
  );
}
