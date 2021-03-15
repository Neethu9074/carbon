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
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerQueueManager.domainName')}>
        {data.get('domainName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerQueueManager.qmName')}>
        {data.get('qmName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerQueueManager.remoteHost')}>
        {data.get('remoteHost')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmDataPowerQueueManager.state')}>
        {data.get('state')}
      </DescriptionItem>
    </DescriptionList>
  );
}
