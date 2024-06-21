/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '@instana/components';

import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleApplicationName')}>
        {data.get('environment_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleEnvironmentName')}>
        {data.get('application_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleEnvironmentID')}>
        {data.get('environment_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleDateCreated')}>
        {formatDateTime(data.get('date_created'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleEnvironmentARN')}>
        {data.get('environment_arn')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleDescription')}>{data.get('description')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleStatus')}>{data.get('health_status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleVersionLabel')}>
        {data.get('version_label')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleSolutionStack')}>
        {data.get('solution_stack')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsBeanstalk.titleEnvironmentURL')}>
        {data.get('environment_url')}
      </DescriptionItem>
    </DescriptionList>
  );
}
