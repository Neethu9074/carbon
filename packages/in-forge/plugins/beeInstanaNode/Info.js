/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function BeeInstanaInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.beeInstana.infoTitle')}>{data.get('pid')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
