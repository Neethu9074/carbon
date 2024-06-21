/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: SnapshotData }) {
  const data = snapshot.get('data');

  return (
    <>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoKind')}>{data.get('kind')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoState')}>{data.get('state')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoVersion')}>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azurePostgreSQL.infoMaxConnections')}>
          {data.get('configurations.max_connections')}
        </DescriptionItem>
      </DescriptionList>
    </>
  );
}
