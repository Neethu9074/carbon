/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function ReplicatedInfo({ snapshot, peer }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.address')}>
        {data.get('quorum.' + peer + '.address')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.startedAt')}>
        {formatDateTime(data.get('quorum.' + peer + '.started_at'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.state')}>
        {data.get('quorum.' + peer + '.state')}
      </DescriptionItem>
    </DescriptionList>
  );
}
