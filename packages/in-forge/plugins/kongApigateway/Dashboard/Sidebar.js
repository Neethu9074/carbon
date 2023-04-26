/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/kongApigateway/Info';
import { kongEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function KongSidebar({ snapshot }) {
  if (kongEnabled) {
    return (
      <div>
        <Collapsible initiallyOpen>
          <Collapsible.Header>{t('in-forge:plugins.kongApigateway.kong')}</Collapsible.Header>
          <Collapsible.Content>
            <Info snapshot={snapshot} />
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
  return null;
}
