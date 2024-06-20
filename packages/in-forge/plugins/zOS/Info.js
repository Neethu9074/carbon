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
      <DescriptionItem title={t('in-forge:plugins.zOS.wlmMode')}>
        {data.get('System_CPU_Utilization.wlm_mode')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zOS.sysplexName')}>
        {data.get('System_CPU_Utilization.sysplex_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zOS.smfid')}>
        {data.get('System_CPU_Utilization.smf_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zOS.managedSystem')}>
        {data.get('System_CPU_Utilization.managed_system')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zOS.productCode')}>
        {data.get('System_CPU_Utilization.product_code')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zOS.cpuCount')}>
        {data.get('System_CPU_Utilization.physical_cpu_count')}
      </DescriptionItem>
    </DescriptionList>
  );
}
