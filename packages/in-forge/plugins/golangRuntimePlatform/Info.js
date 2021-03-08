/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function GolangInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.golangRuntimePlatform.name')}>
        {data.get('snapshot.name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.golangRuntimePlatform.goroot')}>
        {data.get('snapshot.goroot')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.golangRuntimePlatform.compiler')}>
        {data.get('snapshot.compiler')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.golangRuntimePlatform.gomaxprocs')}>
        {data.get('snapshot.maxprocs')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.golangRuntimePlatform.visibleCpUs')}>
        {data.get('snapshot.cpu')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.golangRuntimePlatform.processId')}>{data.get('pid')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.golangRuntimePlatform.instanaSensorVersion')}>
        {data.get('snapshot.iv')}
      </DescriptionItem>
    </DescriptionList>
  );
}
