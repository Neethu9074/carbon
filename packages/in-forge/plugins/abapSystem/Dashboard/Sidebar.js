/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import AbapSystemSidebar from 'in-sap/lists/components/AbapSystemSidebar';
import { t } from 'in-i18n';
import Info from '../Info';

export default function sapAbapSystemSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.abapSystem.label')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <AbapSystemSidebar snapshotId={snapshot.get('id')} />
    </div>
  );
}
