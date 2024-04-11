/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import MatchExpressionList from 'in-forge/plugins/websiteHttpd/MatchExpressionList';
import Info from 'in-forge/plugins/websiteHttpd/Info';
import { t } from 'in-i18n';

export default function EumWebsiteHttpdSidebar({ snapshot }: { snapshot: any }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.eum.dashboard.website')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <MatchExpressionList snapshot={snapshot} />
    </div>
  );
}
