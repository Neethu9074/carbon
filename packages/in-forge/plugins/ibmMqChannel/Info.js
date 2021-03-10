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
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.name')}>{data.get('channelName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.status')}>{data.get('channelStatus')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.inDoubt')}>{data.get('channelInDoubt')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.substate')}>
        {data.get('channelSubStatus')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.connectionName')}>
        {data.get('connectionName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.remoteQueueManager')}>
        {data.get('remoteQM')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.lastMessageDateTime')}>
        {data.get('lastMessage')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqChannel.startDateTime')}>
        {data.get('startDateTime')}
      </DescriptionItem>
    </DescriptionList>
  );
}
