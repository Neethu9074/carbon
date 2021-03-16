/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  const addedToClusterTime = data.get('addedToClusterTime');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.awsMskBroker.id')}>{data.get('brokerId')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMskBroker.arn')}>{data.get('nodeArn')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMskBroker.type')}>{data.get('nodeType')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMskBroker.instanceType')}>
        {data.get('instanceType')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.awsMskBroker.addedToCluster')}>
        {formatDateTime(addedToClusterTime)}
      </DescriptionItem>
    </DescriptionList>
  );
}
