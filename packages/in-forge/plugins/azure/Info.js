/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azure.name')}>{data.get('instance-name')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.azure.instanceId')}>{data.get('instance-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.azure.type')}>{data.get('instance-type')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.azure.availabilityZone')}>
          {data.get('availability-zone')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
