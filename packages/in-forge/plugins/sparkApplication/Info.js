/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesZeroDecimalPlaces, msZeroDecimalPlaces } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const executorMemory = data.get('executorMemory');
  const batchDuration = data.get('batchDuration');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.applicationName')}>
        {data.get('appName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.applicationId')}>
        {data.get('appId')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.sparkUser')}>
        {data.get('sparkUser')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.master')}>{data.get('master')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.executorMemory')}>
        {executorMemory ? bytesZeroDecimalPlaces(executorMemory * 1024 * 1024) : null}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.batchDuration')}>
        {batchDuration ? msZeroDecimalPlaces(data.get('batchDuration')) : null}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sparkApplication.streamingApplication')}>
        {yesOrNo(data.get('streamingApp'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
