/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '@instana/components';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.titleARN')}>{data.get('taskArn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleCluster')}>{data.get('clusterArn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleTaskDefinitionARN')}>
        {data.get('taskDefinitionArn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleTaskDefinitionName')}>
        {data.get('taskDefinition')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleTaskDefinitionVersion')}>
        {data.get('taskDefinitionVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleRegion')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleAvailabilityZone')}>
        {data.get('availabilityZone')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleDesiredStatus')}>
        {data.get('desiredStatus')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleKnownStatus')}>
        {data.get('knownStatus')}
      </DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.awsEcsTask.titlePullStarted')}
        dateTime={data.get('pullStartedAt')}
      />
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.awsEcsTask.titlePullStopped')}
        dateTime={data.get('pullStoppedAt')}
      />
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleCPULimit')}>{data.get('limits.cpu')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsTask.titleMemoryLimit')}>
        {data.get('limits.memory')}
      </DescriptionItem>
    </DescriptionList>
  );
}
