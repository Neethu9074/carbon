/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Info from 'in-forge/plugins/tibcoBWAppInst/Info';
import { t } from 'in-i18n';

export default function TibcoBWAppInstSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>{t('in-forge:plugins.tibcoBWAppInst.tibcoBWAppInst')}</Collapsible.Header>
      <Collapsible.Content>
        <Info snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
}
