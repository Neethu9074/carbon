/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/instanaAgent/Info';
import { t } from 'in-i18n';

export default function InstanaAgentSidebar({ snapshot }) {
  const args = snapshot.getIn(['data', 'proc.args']);
  const env = snapshot.getIn(['data', 'proc.env']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.instanaAgent.dashboard.configuration')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      {args && args.size > 0 ? (
        <KeyValueOverlay header={t('in-forge:plugins.process.dashboard.arguments')} data={args} sort={false} />
      ) : null}

      <KeyValueOverlay header={t('in-forge:plugins.process.dashboard.environmentVariables')} data={env} />
    </div>
  );
}
