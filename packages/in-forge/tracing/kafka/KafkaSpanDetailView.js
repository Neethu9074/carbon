/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function KafkaSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.kafka.titleAccessType')}>{span.getIn(['data', 'kafka', 'access'])}</Di>
        <Di title={t('in-forge:tracing.kafka.titleTopic')}>{span.getIn(['data', 'kafka', 'service'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'kafka', 'error'])} />
      </Dl>
    </div>
  );
}
