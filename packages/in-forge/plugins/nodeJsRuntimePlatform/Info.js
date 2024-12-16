/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import HealthcheckResultDescriptionItem from 'in-forge/plugins/nodeJsRuntimePlatform/HealthcheckResultDescriptionItem';
import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function NodeJsInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.nodeJsRuntimePlatform.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nodeJsRuntimePlatform.version')}>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nodeJsRuntimePlatform.description')}>
        {data.get('description')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nodeJsRuntimePlatform.processId')}>{data.get('pid')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <HealthcheckResultDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.nodeJsRuntimePlatform.applicationArguments')}>
        {data.get('args', []).join(' ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nodeJsRuntimePlatform.runtimeArguments')}>
        {data.get('execArgs', []).join(' ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nodeJsRuntimePlatform.inProcessCollectorVersion')}>
        {data.get('sensorVersion')}
      </DescriptionItem>
    </DescriptionList>
  );
}
