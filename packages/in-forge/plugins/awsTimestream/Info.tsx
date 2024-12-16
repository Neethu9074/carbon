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
    <>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.arn')}>{data.get('db_arn')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('db_name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.region')}>
          {data.get('aws_grouping_zone')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsTimestream.infoTitle.groupCreatedTime')}>
          {data.get('db_created_time')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsTimestream.infoTitle.type')}>
          {data.get('db_type')}
        </DescriptionItem>
      </DescriptionList>
    </>
  );
}
