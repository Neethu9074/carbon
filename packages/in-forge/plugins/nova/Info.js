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
        <DescriptionItem title={t('in-forge:plugins.nova.hostname')}>{data.get('public-hostname')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.nova.instanceId')}>{data.get('instance-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.nova.projectId')}>{data.get('project-id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.nova.availabilityZone')}>
          {data.get('availability-zone')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
