/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import KubernetesInfo from 'in-forge/plugins/syntheticPoP/Dashboard/KubernetesInfo';
import EngineList from 'in-forge/plugins/syntheticPoP/Dashboard/EngineList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Info from 'in-forge/plugins/syntheticPoP/Info';
import { t } from 'in-i18n';

export default function SyntheticPoPSidebar({ snapshot }) {
  const tags = snapshot.getIn(['data', 'tags']);
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.syntheticPoP.dashboard.pop')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      {tags?.size > 0 && (
        <KeyValueOverlay header={t('in-forge:plugins.syntheticPoP.dashboard.tags')} data={tags} sort={false} />
      )}
      <EngineList snapshot={snapshot} />
      <KubernetesInfo snapshot={snapshot} />
    </>
  );
}
