/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.name')}>{data.get('clusterName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.type')}>{data.get('clusterType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.creationDate')}>
        {data.get('clusterCreationDate')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.cloudProvider')}>
        {data.get('clusterProvider')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.region')}>{data.get('clusterRegion')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.instanceSizeName')}>
        {data.get('clusterInstanceSizeName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.project')}>
        {data.get('clusterProjectName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDbCluster.organisation')}>
        {data.get('clusterOrganisationName')}
      </DescriptionItem>
    </DescriptionList>
  );
}
