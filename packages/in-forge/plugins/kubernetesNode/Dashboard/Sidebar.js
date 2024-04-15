/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import ConditionsList from 'in-forge/plugins/kubernetesCluster/Sidebar/ConditionsList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function KubernetesNodeSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.kubernetesNode.kubernetesNode')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <ConditionsList snapshot={snapshot} />
    </div>
  );
}
