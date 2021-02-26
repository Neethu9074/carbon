/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { megaBytesZeroDecimalPlaces, seconds } from 'in-services/formatters/number';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.arn')}>{data.get('arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.description')}>{data.get('description')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.runtime')}>{data.get('runtime')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.handler')}>{data.get('handler')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.timeout')}>
        {seconds.fixedCompact(data.get('timeout'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.memorySize')}>
        {megaBytesZeroDecimalPlaces(data.get('memory_size'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.lastModified')}>
        {formatDateTime(data.get('last_modified'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.region')}>{data.get('aws_grouping_zone')}</DescriptionItem>
    </DescriptionList>
  );
}
