/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Info from 'in-forge/plugins/sapAbapInstanceSensor/Info';
import { t } from 'in-i18n';

export default function sapAbapInstanceSidebar({ snapshot }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.abapInstance.label')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </>
  );
}
