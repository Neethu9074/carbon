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
      <DescriptionItem title={t('in-forge:plugins.zDb2.mvsSystem')}>
        {data.get('DB2_System_States.mvs_system')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zDb2.originNode')}>
        {data.get('DB2_System_States.originnode')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zDb2.db2Version')}>
        {data.get('DB2_System_States.db2_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zDb2.db2Subsystem')}>
        {data.get('DB2_System_States.db2_subsystem')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zDb2.productCode')}>
        {data.get('DB2_System_States.product_code')}
      </DescriptionItem>
    </DescriptionList>
  );
}
