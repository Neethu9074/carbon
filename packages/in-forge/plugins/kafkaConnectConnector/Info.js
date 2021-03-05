/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function KafkaConnectConnectorInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectConnector.connectorName')}>
        {data.get('connectorName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectConnector.connectorClass')}>
        {data.get('connectorClass')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectConnector.connectorType')}>
        {data.get('connectorType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.kafkaConnectConnector.connectorVersion')}>
        {data.get('connectorVersion')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
