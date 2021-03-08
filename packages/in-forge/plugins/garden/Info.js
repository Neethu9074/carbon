/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function GardenInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.garden.id')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.containerIp')}>{data.get('containerIP')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.hostIp')}>{data.get('hostIP')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.containerPath')}>{data.get('containerPath')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.state')}>{data.get('state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.status')}>{data.get('status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.orgId')}>{data.get('orgId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.spaceId')}>{data.get('spaceId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.appId')}>{data.get('appId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.garden.instanceIndex')}>
        {data.get('cfInstanceIndex')}
      </DescriptionItem>
    </DescriptionList>
  );
}
