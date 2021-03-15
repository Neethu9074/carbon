/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoName')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoResourceGroup')}>
        {data.get('resourceGroup')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoLocation')}>
        {data.get('location')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoSubscriptionID')}>
        {data.get('subscription')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoType')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoPublisher')}>
        {data.get('publisherName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoProvisioningState')}>
        {data.get('provisioningState')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoGatewayUrl')}>
        {data.get('gatewayUrl')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoPortalUrl')}>
        {data.get('portalUrl')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.azureApiManagement.infoTier')}>{data.get('sku')}</DescriptionItem>
    </DescriptionList>
  );
}
