/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Info from 'in-forge/plugins/drbdPeerDevice/Info';
import { t } from 'in-i18n';

export default function DrbdPeerSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.drbdPeerDevice.drbdPeerDevice')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </Fragment>
  );
}
