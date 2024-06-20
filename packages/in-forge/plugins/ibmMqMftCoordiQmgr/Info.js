/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.coordiQmgrName')}>
        {data.get('coordiQmgrName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.coordiQmgrHost')}>
        {data.get('coordiQmgrHost')}
      </DescriptionItem>
    </DescriptionList>
  );
}
