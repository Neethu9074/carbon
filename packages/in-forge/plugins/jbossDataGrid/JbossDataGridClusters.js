/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { msZeroDecimalPlaces } from 'in-services/formatters/number';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyMap } from 'in-services/fixedImmutables';

const formatBoolean = value => (value ? 'Yes' : 'No');
const nullOrFormatBoolean = value => (value == null ? null : formatBoolean(value));
const nullOrMsZeroDecimalPlaces = value => (value == null ? null : msZeroDecimalPlaces(value));

export default function JbossDataGridClusters({ snapshot }) {
  const data = snapshot.get('data');
  const clusters = data.get('clusters', emptyMap);

  return (
    <div>
      {clusters
        .map((clusterInfo, clusterName) => (
          <Collapsible initiallyOpen={false} key={clusterName}>
            <Collapsible.Header>
              {t('in-forge:plugins.jbossDataGrid.jGroupsClusterName', { clusterName: clusterName })}
            </Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.channelName')}>
                  {clusterInfo.get('channelName')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.channelAddress')}>
                  {clusterInfo.get('channelAddress')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.channelState')}>
                  {clusterInfo.get('channelState')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.channelStatisticsEnabled')}>
                  {nullOrFormatBoolean(clusterInfo.get('channelStats'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.udpStatisticsEnabled')}>
                  {nullOrFormatBoolean(clusterInfo.get('udpStats'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadPoolEnabled')}>
                  {nullOrFormatBoolean(clusterInfo.get('thread_pool.enabled'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadPoolMaxThreads')}>
                  {clusterInfo.get('thread_pool.max_threads')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadPoolMinThreads')}>
                  {clusterInfo.get('thread_pool.min_threads')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadPoolKeepAliveTime')}>
                  {nullOrMsZeroDecimalPlaces(clusterInfo.get('thread_pool.keep_alive_time'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadPoolQueueEnabled')}>
                  {nullOrFormatBoolean(clusterInfo.get('thread_pool.queue_enabled'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadPoolQueueMaxSize')}>
                  {clusterInfo.get('thread_pool.queue_max_size')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.incomingMessagesThreadPoolRejectionPolicy')}>
                  {clusterInfo.get('thread_pool.rejection_policy')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.oobMessagesThreadPoolEnabled')}>
                  {nullOrFormatBoolean(clusterInfo.get('oob_thread_pool.enabled'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.oobMessagesThreadPoolMaxThreads')}>
                  {clusterInfo.get('oob_thread_pool.max_threads')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.oobMessagesThreadPoolMinThreads')}>
                  {clusterInfo.get('oob_thread_pool.min_threads')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.oobMessagesThreadPoolKeepAliveTime')}>
                  {nullOrMsZeroDecimalPlaces(clusterInfo.get('oob_thread_pool.keep_alive_time'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.oobMessagesThreadPoolQueueEnabled')}>
                  {nullOrFormatBoolean(clusterInfo.get('oob_thread_pool.queue_enabled'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.oobMessagesThreadPoolQueueMaxSize')}>
                  {clusterInfo.get('oob_thread_pool.queue_max_size')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.oobMessagesThreadPoolRejectionPolicy')}>
                  {clusterInfo.get('oob_thread_pool.rejection_policy')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.timerThreadPoolMaxThreads')}>
                  {clusterInfo.get('timer.max_threads')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.timerThreadPoolMinThreads')}>
                  {clusterInfo.get('timer.min_threads')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.timerThreadPoolKeepAliveTime')}>
                  {nullOrMsZeroDecimalPlaces(clusterInfo.get('timer.keep_alive_time'))}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.timerThreadPoolQueueMaxSize')}>
                  {clusterInfo.get('timer.queue_max_size')}
                </DescriptionItem>
                <DescriptionItem title={t('in-forge:plugins.jbossDataGrid.timerThreadPoolRejectionPolicy')}>
                  {clusterInfo.get('timer.rejection_policy')}
                </DescriptionItem>
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>
        ))
        .valueSeq()
        .toArray()}
    </div>
  );
}
