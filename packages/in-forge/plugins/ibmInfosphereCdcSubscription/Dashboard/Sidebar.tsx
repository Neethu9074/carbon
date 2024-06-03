/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import Info from 'in-forge/plugins/ibmInfosphereCdcSubscription/Info';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

interface IbmInfosphereSubscritpionProps {
  snapshot: SnapshotData;
}

const IbmInfosphereSubscritpionSidebar = ({ snapshot }: IbmInfosphereSubscritpionProps) => {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.ibmInfosphereCdcSubscription.ibmInfosphereSubscription')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
};

export default IbmInfosphereSubscritpionSidebar;
