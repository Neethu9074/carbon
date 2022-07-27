/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.zCics.originNode')}>
        {data.get('CICSplex_Region_Overview.origin_node')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCics.systemId')}>
        {data.get('CICSplex_Region_Overview.system_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCics.cicsRegionName')}>
        {data.get('CICSplex_Region_Overview.cics_region_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCics.cicsVersion')}>
        {data.get('CICSplex_Region_Overview.cics_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.zCics.cicsplexName')}>
        {data.get('CICSplex_Region_Overview.cicsplex_name')}
      </DescriptionItem>
    </DescriptionList>
  );
}
