/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Neo4jInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.neo4j.version')}>{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.neo4j.databaseName')}>{data.get('databaseName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.neo4j.storeId')}>{data.get('storeId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.neo4j.storeDirectory')}>{data.get('storeDirectory')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.neo4j.boltListenAddress')}>{data.get('boltAddress')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.neo4j.httpListenAddress')}>{data.get('httpAddress')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.neo4j.httpsListenAddress')}>
        {data.get('httpsAddress')}
      </DescriptionItem>
    </DescriptionList>
  );
}
