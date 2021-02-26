/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function CassandraCommunicationInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleNodeState')}>{data.get('mode')}</DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleGossipRunning')}>
        {data.get('gossipRunning')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleThriftRunning')}>
        {data.get('thriftRunning')}
      </DescriptionItem>

      <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleNativeRunning')}>
        {data.get('nativeTransportRunning')}
      </DescriptionItem>
    </DescriptionList>
  );
}
