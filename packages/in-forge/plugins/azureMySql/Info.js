/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoFullyQualifiedDomainName')}>
          {data.get('fullyQualifiedDomainName')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoLocation')}>{data.get('location')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoKind')}>{data.get('kind')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoState')}>{data.get('state')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoVersion')}>{data.get('version')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureMySql.infoMaxConnections')}>
          {data.get('configurations.max_connections')}
        </DescriptionItem>
      </DescriptionList>
    </>
  );
}
