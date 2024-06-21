/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function MongoDBInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.mongoDb.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDb.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDb.storageEngine')}>{data.get('storageEngine')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDb.replicaSetName')}>
        {data.get('replicaSetName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.mongoDb.role')}>{data.get('role')}</DescriptionItem>
    </DescriptionList>
  );
}
