/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function KinesisSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.kinesis.titleStream')}>{span.getIn(['data', 'kinesis', 'stream'])}</Di>
        <Di title={t('in-forge:tracing.kinesis.titleOperation')}>{span.getIn(['data', 'kinesis', 'op'])}</Di>
        <Di title={t('in-forge:tracing.kinesis.titleRecord')}>{span.getIn(['data', 'kinesis', 'record'])}</Di>
        <Di title={t('in-forge:tracing.kinesis.titleShard')}>{span.getIn(['data', 'kinesis', 'shard'])}</Di>
        <Di title={t('in-forge:tracing.kinesis.titleShardType')}>{span.getIn(['data', 'kinesis', 'shardType'])}</Di>
        <Di title={t('in-forge:tracing.kinesis.titleStartSequenceNumber')}>
          {span.getIn(['data', 'kinesis', 'startSequenceNumber'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'kinesis', 'error'])} />
      </Dl>
    </div>
  );
}
