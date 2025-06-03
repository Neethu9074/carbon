/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import Info from 'in-forge/plugins/ibmiAuditJournalsInfo/Info.js';
import { t } from 'in-i18n';

export default function IbmIAuditJournalsInfoSidebar({ snapshot }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.ibmiAuditJournalsInfo.sidebar.ibmiAuditJournalsInfo')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </>
  );
}
