/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { getRuntimeByKey } from 'in-sdk/snapshot/runtimes';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.service')}>
        {data.get('service')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.revision')}>
        {data.get('revision')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.configuration')}>
        {data.get('configuration')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.region')}>
        {data.get('region')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.numericProjectId')}>
        {data.get('numericProjectId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.projectId')}>
        {data.get('projectId')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.runtime')}>
        {getRuntimeByKey(data.get('runtime')).label}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.port')}>
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.googleCloudRunServiceRevisionInstance.instanceId')}>
        {data.get('instanceId')}
      </DescriptionItem>
    </DescriptionList>
  );
}
