/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import KubernetesInfo from 'in-forge/plugins/host/Dashboard/KubernetesInfo';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import InterfaceList from 'in-forge/plugins/host/InterfaceList';
import HostHardware from 'in-forge/plugins/host/HostHardware';
import VsphereInfo from 'in-forge/plugins/host/VsphereInfo';
import { vsphereEnabled } from 'in-services/featureFlags';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function HostSidebar({ snapshot }) {
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

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
