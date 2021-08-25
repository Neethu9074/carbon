/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.aliCloudMysql.region')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudMysql.zoneId')}>{data.get('ZoneId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudMysql.engine')}>
        {data.get('Engine')} {data.get('EngineVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudMysql.instanceName')}>
        {data.get('InstanceName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudMysql.instanceType')}>
        {data.get('InstanceType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aliCloudMysql.instanceStatus')}>
        {data.get('InstanceStatus')}
      </DescriptionItem>
    </DescriptionList>
  );
}
