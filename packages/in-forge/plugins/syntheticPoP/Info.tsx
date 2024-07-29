/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function SyntheticPoPInfo({ snapshot }: { snapshot: any }) {
  const data = snapshot.get('data');
  const startedAt = data.get('properties.startedAt');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.locationName')}>
        {data.get('properties.locationName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.locationDisplayName')}>
        {data.get('properties.locationDisplayName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.locationDescription')}>
        {data.get('properties.locationDescription')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.version')}>
        {data.get('properties.version')}
      </DescriptionItem>
      {startedAt && (
        <DescriptionItem title={t('in-forge:plugins.syntheticPoP.startedAt')}>
          {formatDateTime(startedAt)} ({fromNowAccurately(startedAt)})
        </DescriptionItem>
      )}
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.playbackCapabilities')}>
        {data.get('properties.playbackCapabilities')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.instanaSyntheticEndpoint')}>
        {data.get('properties.instanaSyntheticEndpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.country')}>
        {data.get('properties.country')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.city')}>{data.get('properties.city')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.redisTlsEnabled')}>
        {data.get('properties.redisTlsEnabled')
          ? t('in-forge:plugins.syntheticPoP.redisEnabled')
          : t('in-forge:plugins.syntheticPoP.redisDisabled')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.syntheticPoP.tenantType')}>
        {data.get('properties.tenantType')}
      </DescriptionItem>
    </DescriptionList>
  );
}
