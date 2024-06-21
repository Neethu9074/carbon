/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.zIms.imsId')}>{data.get('ims_health.ims_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zIms.imsplexName')}>
        {data.get('ims_health.imsplex_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zIms.mvsSystem')}>
        {data.get('ims_health.mvs_system')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zIms.sysplexName')}>
        {data.get('ims_health.sysplex_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zIms.sqgroupName')}>
        {data.get('ims_health.sqgroup_name')}
      </DescriptionItem>
    </DescriptionList>
  );
}
