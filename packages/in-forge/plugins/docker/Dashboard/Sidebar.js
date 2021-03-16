/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KubernetesInfo from 'in-infrastructure/Dashboard/components/KubernetesInfo';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import MarathonInfo from 'in-forge/plugins/docker/MarathonInfo';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import NomadInfo from 'in-forge/plugins/docker/NomadInfo';
import Ports from 'in-forge/plugins/docker/Ports';
import Info from 'in-forge/plugins/docker/Info';
import { t } from 'in-i18n';

export default function DockerSidebar({ snapshot }) {
  const labels = snapshot.getIn(['data', 'Labels']);
  const ports = snapshot.getIn(['data', 'PortBindings']) || snapshot.getIn(['data', 'Ports']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.docker.dashboard.dockerContainer')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {ports && ports.size > 0 ? (
        <div>
          <Collapsible>
            <Collapsible.Header>{t('in-forge:plugins.docker.dashboard.ports')}</Collapsible.Header>
            <Collapsible.Content>
              <Ports snapshot={snapshot} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      ) : null}

      <KeyValueOverlay header={t('in-forge:plugins.docker.dashboard.containerLabels')} data={labels} />

      <MarathonInfo snapshot={snapshot} />

      <NomadInfo snapshot={snapshot} />

      <KubernetesInfo snapshot={snapshot} labels={labels} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
