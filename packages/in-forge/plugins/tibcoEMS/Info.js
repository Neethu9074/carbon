/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { positiveNumber } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const snapshotData = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{snapshotData.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.processId')}>{snapshotData.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{snapshotData.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.infoTitle.ports')}>
        {snapshotData.get('ports', emptyList).sort().join(', ')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.state')}>{snapshotData.get('state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.maxConnections')}>
        {positiveNumber(snapshotData.get('maxConnections'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
