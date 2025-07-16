/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Collapsible } from '@instana/components';

// @ts-expect-error needs TS migration
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Info from 'in-forge/plugins/sapJavaNetWeaverInstanceSensor/Info';
import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default function sapJavaNetWeaverInstanceSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.label')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </>
  );
}
