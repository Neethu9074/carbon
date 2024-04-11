/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Collapsible } from '@instana/components';

import Info from 'in-forge/plugins/tuxedoAppServiceBrokerProject/Info';
import { t } from 'in-i18n';

export default function TuxedoAppServiceBrokerProjectSidebar({ snapshot }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.tuxedoAppServiceBrokerProject.tuxedoAppServiceBrokerProject')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </Fragment>
  );
}
