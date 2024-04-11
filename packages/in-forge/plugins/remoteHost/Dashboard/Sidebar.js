/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KubernetesInfo from 'in-forge/plugins/remoteHost/Dashboard/KubernetesInfo';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import InterfaceList from 'in-forge/plugins/remoteHost/InterfaceList';
import HostHardware from 'in-forge/plugins/remoteHost/HostHardware';
import VsphereInfo from 'in-forge/plugins/remoteHost/VsphereInfo';
import { vsphereEnabled } from 'in-services/featureFlags';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function RemoteHostSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.host.dashboard.system')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <InterfaceList snapshot={snapshot} />

      <HostHardware snapshotId={snapshot.get('id')} />

      <KubernetesInfo snapshotId={snapshot.get('id')} />

      {vsphereEnabled && <VsphereInfo snapshotId={snapshot.get('id')} />}

      <KeyValueOverlay
        header={t('in-forge:plugins.host.dashboard.packages')}
        data={snapshot.getIn(['data', 'packages'])}
      />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
