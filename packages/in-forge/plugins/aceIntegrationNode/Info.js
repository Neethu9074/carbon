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
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.brokerName')}>
        {data.get('brokerName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.type')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.defaultQueueManagerName')}>
        {data.get('defaultQueueManagerName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.httpConnectorPort')}>
        {data.get('httpConnectorPort')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.httpsConnectorPort')}>
        {data.get('httpsConnectorPort')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.restAdminListenerPort')}>
        {data.get('restAdminListenerPort')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.productName')}>
        {data.get('productName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.buildLevel')}>
        {data.get('buildLevel')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.platformName')}>
        {data.get('platformName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.platformArchitecture')}>
        {data.get('platformArchitecture')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationNode.platformVersion')}>
        {data.get('platformVersion')}
      </DescriptionItem>
    </DescriptionList>
  );
}
