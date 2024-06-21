/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function IbmCloudEventStreamInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudEventStream.instance')}>
        {data.get('instance')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudEventStream.zone')}>{data.get('zone')}</DescriptionItem>
    </DescriptionList>
  );
}
