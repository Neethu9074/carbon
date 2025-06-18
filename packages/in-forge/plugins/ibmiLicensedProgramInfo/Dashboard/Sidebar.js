/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import { t } from 'in-i18n';
import Info from '../Info';

export default function IbmiLicensedProgramInfoSidebar({ snapshot }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.ibmiLicensedProgramInfo.sidebar.ibmiLicensedProgramInfo')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </>
  );
}
