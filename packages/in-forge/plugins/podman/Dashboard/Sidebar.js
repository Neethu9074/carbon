/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Collapsible, PreviewPill } from '@instana/components';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import PodmanPodInfo from 'in-forge/plugins/podman/PodmanPodInfo';
import Info from 'in-forge/plugins/podman/Info';
import { t } from 'in-i18n';

export default function PodmanSidebar({ snapshot }) {
  const annotations = snapshot.getIn(['data', 'Annotations']);
  const labels = snapshot.getIn(['data', 'Labels']);
  const podId = snapshot.getIn(['data', 'PodId']);
  const nameSpace = snapshot.getIn(['data', 'Namespace']);
  const podName = snapshot.getIn(['data', 'PodName']);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.podman.dashboard.podmanContainer')} <PreviewPill />
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <KeyValueOverlay header={t('in-forge:plugins.podman.dashboard.podmanLabels')} data={labels} />
      <PodmanPodInfo
        snapshot={snapshot}
        annotations={annotations}
        podid={podId}
        namespace={nameSpace}
        podName={podName}
      />
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
