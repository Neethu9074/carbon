/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.opc.name')}>{data.get('instance-name')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.opc.instanceId')}>{data.get('instance-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.opc.type')}>{data.get('instance-type')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.opc.availabilityZone')}>
          {data.get('availability-zone')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.opc.image')}>{data.get('image-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.opc.compartment')}>{data.get('compartment-id')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
