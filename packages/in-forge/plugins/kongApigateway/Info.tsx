/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

interface KongInfoProps {
  snapshot: any;
}

export default function KongInfo({ snapshot }: KongInfoProps): JSX.Element {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.hostName')}>{data.get('hostName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.nodeId')}>{data.get('nodeId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.luaVersion')}>
        {data.get('luaVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kongApigateway.kongVersion')}>
        {data.get('kongVersion')}
      </DescriptionItem>
    </DescriptionList>
  );
}
