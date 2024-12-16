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
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseShard.status')}>{data.get('status')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseShard.role')}>{data.get('role')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redisEnterpriseShard.clusterName')}>
        {data.get('clusterName')}
      </DescriptionItem>
    </DescriptionList>
  );
}
