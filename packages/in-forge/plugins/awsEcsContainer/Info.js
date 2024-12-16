/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '@instana/components';

import { DateTimeWithPeriodSinceDescriptionItem } from 'in-sdk/components/sidebar/DateTimeWithPeriodSinceDescriptionItem';
import { getRuntimeByKey } from 'in-sdk/snapshot/runtimes';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleName')}>
        {data.get('containerName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleRuntime')}>
        {getRuntimeByKey(data.get('runtime')).label}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleDockerId')}>
        {data.get('dockerId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleDockerName')}>
        {data.get('dockerName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleContainerName')}>
        {data.get('containerName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleImage')}>{data.get('image')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleImageId')}>
        {data.get('imageId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleTaskARN')}>
        {data.get('taskArn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleTaskDefinitionName')}>
        {data.get('taskDefinition')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleTaskDefinitionVersion')}>
        {data.get('taskDefinitionVersion')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleClusterARN')}>
        {data.get('clusterArn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleDesiredStatus')}>
        {data.get('desiredStatus')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleKnownStatus')}>
        {data.get('knownStatus')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleCPULimit')}>
        {data.get('limits.cpu')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEcsContainer.titleMemoryLimit')}>
        {data.get('limits.memory')}
      </DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.awsEcsContainer.titleCreatedAt')}
        dateTime={data.get('createdAt')}
      />
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.awsEcsContainer.titleStartedAt')}
        dateTime={data.get('startedAt')}
      />
      <DescriptionItem title={t('in-forge:plugins.titleRegion')}>{data.get('region')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleType')}>{data.get('type')}</DescriptionItem>
    </DescriptionList>
  );
}
