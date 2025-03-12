/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RemoteServiceAgentCorrelationButton from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationButton';
import PluginIcon from 'in-components/PluginIcon/PluginIcon';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

import relatedStyles from 'in-sdk/components/sidebar/RelatedSnapshotList.mless';

export default function RemoteServiceAgentCorrelationComponent({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <Collapsible>
      <Collapsible.Header>
        <div className={relatedStyles.snapshotListHeader}>
          <PluginIcon plugin="instanaAgent" className={relatedStyles.snapshotListPluginIcon} />
          <span>{t('in-forge:pluginName_instanaAgent')}</span>
        </div>
      </Collapsible.Header>
      <Collapsible.Content>
        <RemoteServiceAgentCorrelationButton snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
}
