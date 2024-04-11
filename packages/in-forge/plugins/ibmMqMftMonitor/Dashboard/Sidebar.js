/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { Collapsible } from '@instana/components';

import Info from 'in-forge/plugins/ibmMqMftMonitor/Info';
import { t } from 'in-i18n';

export default function IbmMqMftMonitorSidebar({ snapshot }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.ibmMqMftMonitor.dashboard.ibmMqMftMonitor')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </Fragment>
  );
}
