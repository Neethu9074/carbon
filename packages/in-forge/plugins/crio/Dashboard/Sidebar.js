/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import KubernetesInfo from 'in-infrastructure/Dashboard/components/KubernetesInfo';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Info from 'in-forge/plugins/crio/Info';
import { t } from 'in-i18n';

export default function CrioSidebar({ snapshot }) {
  const labels = snapshot.getIn(['data', 'labels']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.crio.dashboard.criOContainer')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <KeyValueOverlay header={t('in-forge:plugins.crio.dashboard.headerContainerLabels')} data={labels} />

      <KubernetesInfo snapshot={snapshot} labels={snapshot.getIn(['data', 'labels'])} />

      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
