/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/drbdReactor/Info';
import { t } from 'in-i18n';
import { SnapshotData } from 'in-stores/snapshot/snapshot';

export default function DrbdSidebar({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.drbdReactor.drbdReactor')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </Fragment>
  );
}
