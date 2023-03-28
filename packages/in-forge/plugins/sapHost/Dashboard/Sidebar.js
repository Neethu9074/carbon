/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList/ServiceInstancesList';
import DeployedUnitList from 'in-sdk/components/sidebar/DeployedUnitList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { t } from 'in-i18n';
import Info from '../Info';

export default function sapApplicationSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.sapHost.label')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <DeployedUnitList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
