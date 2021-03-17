/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function IBMEtcdIInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmcloudEtcd.kind')}>{data.get('kind')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmcloudEtcd.members')}>
        {data.get('member_ids').length}
      </DescriptionItem>
    </DescriptionList>
  );
}
