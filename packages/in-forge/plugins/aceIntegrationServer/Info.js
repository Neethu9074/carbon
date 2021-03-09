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
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationServer.serverName')}>
        {data.get('serverName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationServer.type')}>{data.get('type')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.aceIntegrationServer.state')}>{data.get('state')}</DescriptionItem>
    </DescriptionList>
  );
}
