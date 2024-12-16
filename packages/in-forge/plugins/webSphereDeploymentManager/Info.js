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
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.webSphereDeploymentManager.pid')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.webSphereDeploymentManager.serverName')}>
        {data.get('serverName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.webSphereDeploymentManager.hostName')}>
        {data.get('hostName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.webSphereDeploymentManager.cellName')}>
        {data.get('cellName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.webSphereDeploymentManager.version')}>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.webSphereDeploymentManager.serverType')}>
        {data.get('serverType')}
      </DescriptionItem>
    </DescriptionList>
  );
}
