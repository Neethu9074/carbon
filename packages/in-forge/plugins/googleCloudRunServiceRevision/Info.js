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
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevision.service')}>
        {data.get('service')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevision.revision')}>
        {data.get('revision')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevision.configuration')}>
        {data.get('configuration')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevision.region')}>
        {data.get('region')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevision.numericProjectId')}>
        {data.get('numericProjectId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevision.projectId')}>
        {data.get('projectId')}
      </DescriptionItem>
      <DateTimeWithPeriodSinceDescriptionItem
        title={t('in-forge:plugins.googleCloudRunServiceRevision.created')}
        dateTime={data.get('creationTimestamp')}
      />
    </DescriptionList>
  );
}
