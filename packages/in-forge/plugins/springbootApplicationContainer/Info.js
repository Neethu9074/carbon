/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { positiveNumber } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function SpringbootInfo({ snapshot }) {
  const data = snapshot.get('data');
  const ports = data.get('ports', emptyList);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.springBootVersion')}>
        {data.get('springBootVersion')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.infoTitle.status')}>{data.get('status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.port')}>
        {ports ? ports.valueSeq().join(', ') : null}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.httpSessionsLimit')}>
        {positiveNumber(data.get('httpsessionsMax'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
