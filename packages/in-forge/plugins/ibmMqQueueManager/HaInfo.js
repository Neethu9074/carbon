/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible, DescriptionList, DescriptionItem } from '@instana/components';

import List from 'in-sdk/components/sidebar/List';
import { t } from 'in-i18n';

export default function HaInfo({ snapshot }) {
  const data = snapshot.get('data');
  const haType = data.get('haType');
  const standbyNodes = data.get('standbyNodes');
  const elsewhereNodes = data.get('elsewhereNodes');

  if (!haType) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.ibmMqQueueManager.dashboard.haInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.haType')}>
              {data.get('haType')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.haRole')}>
              {data.get('haRole')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.haPreferredLocation')}>
              {data.get('haPreferredLocation')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.haFloatingIp')}>
              {data.get('haFloatingIp')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.runningNode')}>
              {data.get('runningNode')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.drRole')}>
              {data.get('drRole')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.drStatus')}>
              {data.get('drStatus')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.drType')}>
              {data.get('drType')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.drPort')}>
              {data.get('drPort')}
            </DescriptionItem>
            <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.drRemoteIp')}>
              {data.get('drRemoteIp')}
            </DescriptionItem>
            {standbyNodes && (
              <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.standbyNodes')}>
                {standbyNodes.map((item, index) => (
                  <List.Item key={index}>{item}</List.Item>
                ))}
              </DescriptionItem>
            )}
            {elsewhereNodes && (
              <DescriptionItem title={t('in-forge:plugins.ibmMqQueueManager.elsewhereNodes')}>
                {elsewhereNodes.map((item, index) => (
                  <List.Item key={index}>{item}</List.Item>
                ))}
              </DescriptionItem>
            )}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
