/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import KeyValueOverlay from 'in-sdk/components/sidebar/KeyValueOverlay';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');
  const labels = data.get('labels', emptyMap);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.googleCloudPubSubTopic.projectId')}>
          {data.get('projectId')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.googleCloudPubSubTopic.name')}>
          {data.get('topicName')}
        </DescriptionItem>
      </DescriptionList>
      {labels.size > 0 && (
        <KeyValueOverlay header={t('in-forge:plugins.googleCloudPubSubTopic.labels')} data={labels} />
      )}
    </div>
  );
}
