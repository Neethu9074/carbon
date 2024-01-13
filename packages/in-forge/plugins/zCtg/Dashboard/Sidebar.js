/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Info from 'in-forge/plugins/zCtg/Info';
import { t } from 'in-i18n';

export default function ZCtgSidebar({ snapshot }) {
  return (
    <>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.zCtg.label')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </>
  );
}
