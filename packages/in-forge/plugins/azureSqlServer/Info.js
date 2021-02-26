/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoName')}>{data.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoResourceGroup')}>
          {data.get('resourceGroup')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoLocation')}>
          {data.get('location')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoSubscriptionID')}>
          {data.get('subscription')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoType')}>{data.get('type')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoVersion')}>
          {data.get('version')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoFQDN')}>
          {data.get('fullyQualifiedDomainName')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.azureSqlServer.infoState')}>{data.get('state')}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
