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
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.autoScalingGroupName')}>
          {data.get('group_name')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.groupArn')}>
          {data.get('group_arn')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.region')}>
          {data.get('aws_grouping_zone')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.awsAccountId')}>
          {data.get('aws_account_id')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.groupCreatedTime')}>
          {data.get('group_created_time')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.groupMinSize')}>
          {data.get('group_min_size')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.groupMaxSize')}>
          {data.get('group_max_size')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.awsAutoScaling.infoTitle.groupDesiredSize')}>
          {data.get('group_desired_size')}
        </DescriptionItem>
      </DescriptionList>
    </>
  );
}
