/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function ibmCloudMongoDb({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudMongoDb.entity')}>{data.get('entity_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmCloudMongoDb.zone')}>{data.get('zone')}</DescriptionItem>
    </DescriptionList>
  );
}
