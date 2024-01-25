/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/ibmApiConnectSpace/Info';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

interface IbmApiConnectProps {
  snapshot: SnapshotData;
}

const IbmApiConnectSpaceSidebar = ({ snapshot }: IbmApiConnectProps) => {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.ibmApiConnectSpace.ibmApiConnectSpace')}</Collapsible.Header>

        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
};

export default IbmApiConnectSpaceSidebar;
