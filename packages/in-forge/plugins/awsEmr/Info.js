/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsEmr.titleClusterId')}>
        {data.get('emr_cluster_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEmr.titleClusterName')}>
        {data.get('emr_cluster_name')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleStatus')}>{data.get('emr_cluster_status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEmr.titleRunningAMIVersion')}>
        {data.get('emr_ami_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleRegion')}>{data.get('aws_grouping_zone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEmr.titleCreationTime')}>
        {formatDateTime(data.get('emr_cluster_startTime'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
