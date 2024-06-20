/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }: { snapshot: any }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.name')}>{data.get('channelName')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.type')}>{data.get('channelType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.status')}>{data.get('channelStatus')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.clientId')}>{data.get('clientId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.clientUser')}>
        {data.get('clientUser')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.MCAUser')}>{data.get('MCAUser')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.connectionName')}>
        {data.get('connectionName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.protocol')}>{data.get('protocol')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.keepAliveInterval')}>
        {data.get('keepAliveInterval')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.lastMessage')}>
        {data.get('lastMessage')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmMqttChannel.startDateTime')}>
        {data.get('startDateTime')}
      </DescriptionItem>
    </DescriptionList>
  );
}
