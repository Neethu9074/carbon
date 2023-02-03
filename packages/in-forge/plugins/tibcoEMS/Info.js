/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { positiveNumber } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import { just } from '@instana/observables';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      topicNames: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topicNames'),
      queueNames: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'queueNames'),
      snapshot: just(props.snapshot),
    };
  },

  function Info({ topicNames, queueNames, snapshot }) {
    const snapshotData = snapshot.get('data');

    if (!topicNames || !topicNames.get('raw_payload')) {
      return null;
    }

    if (!queueNames || !queueNames.get('raw_payload')) {
      return null;
    }

    return (
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.name')}>{snapshotData.get('name')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.processId')}>{snapshotData.get('pid')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{snapshotData.get('version')}</DescriptionItem>
        <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
        <DescriptionItem title={t('in-forge:plugins.infoTitle.ports')}>
          {snapshotData
            .get('ports', emptyList)
            .sort()
            .join(', ')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.state')}>{snapshotData.get('state')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.maxConnections')}>
          {positiveNumber(snapshotData.get('maxConnections'))}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.topics')}>
          {topicNames.get('raw_payload', emptyList).size}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.infoTitle.queues')}>
          {queueNames.get('raw_payload', emptyList).size}
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
