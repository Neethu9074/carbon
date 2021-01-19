/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KubernetesInfo from 'in-forge/plugins/host/Dashboard/KubernetesInfo';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import InterfaceList from 'in-forge/plugins/host/InterfaceList';
import HostHardware from 'in-forge/plugins/host/HostHardware';
import VsphereInfo from 'in-forge/plugins/host/VsphereInfo';
import TagList from 'in-sdk/components/sidebar/TagList';

import Info from '../Info';

export default function HostSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>System</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <InterfaceList snapshot={snapshot} />

      <HostHardware snapshotId={snapshot.get('id')} />

      <KubernetesInfo snapshotId={snapshot.get('id')} />

      <VsphereInfo snapshotId={snapshot.get('id')} />

      <KeyValueOverlay header="Packages" data={snapshot.getIn(['data', 'packages'])} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
