/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { yesOrNo } from 'in-services/formatters/boolean';
import HostLink from './Dashboard/HostLink';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsEbs.titleVolumeID')}>{data.get('volume_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEbs.titleCreatedAt')}>
        {formatDateTime(data.get('creation_time'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleState')}>{data.get('state')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleSize')}>
        {bytesZeroDecimalPlaces(data.get('size'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleType')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEbs.titleIOPS')}>{data.get('iops')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEbs.titleEncrypted')}>
        {yesOrNo(data.get('encrypted'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEbs.titleMountedInstanceID')}>
        {data.get('mounted_instance_id')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEbs.titleMountedPath')}>
        {data.get('mounted_path')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleRegion')}>{data.get('aws_grouping_zone')}</DescriptionItem>
      <HostLink snapshot={snapshot} />
    </DescriptionList>
  );
}
