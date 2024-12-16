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
      <DescriptionItem title={t('in-forge:plugins.titleARN')}>{data.get('es_domain_arn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.titleRegion')}>{data.get('aws_grouping_zone')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsEs.titleDomainName')}>
        {data.get('es_domain_name')}
      </DescriptionItem>
    </DescriptionList>
  );
}
