/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/instanaAgent/Info';
import { t } from 'in-i18n';

export default function InstanaAgentSidebar({ snapshot }) {
  return (
    <Collapsible initiallyOpen>
      <Collapsible.Header>{t('in-forge:plugins.instanaAgent.dashboard.configuration')}</Collapsible.Header>
      <Collapsible.Content>
        <Info snapshot={snapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
}
