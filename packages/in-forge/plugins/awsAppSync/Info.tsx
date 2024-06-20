/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.arn')}>{data.get('arn')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('api_name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.region')}>
          {data.get('aws_grouping_zone')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAppSync.infoTitle.apiId')}>{data.get('api_id')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAppSync.infoTitle.apiType')}>
          {data.get('api_type')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAppSync.infoTitle.authenticationType')}>
          {data.get('authentication_type')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAppSync.infoTitle.visibility')}>
          {data.get('visibility')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
