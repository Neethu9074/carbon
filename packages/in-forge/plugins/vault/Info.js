/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  const convertBoolToString = bool =>
    bool === true ? t('in-forge:plugins.infoTitle.yes') : t('in-forge:plugins.infoTitle.no');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.initialized')}>
        {convertBoolToString(data.get('initialized'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.sealed')}>
        {convertBoolToString(data.get('sealed'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.standby')}>
        {convertBoolToString(data.get('standby'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.performanceStandby')}>
        {convertBoolToString(data.get('performanceStandBy'))}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
