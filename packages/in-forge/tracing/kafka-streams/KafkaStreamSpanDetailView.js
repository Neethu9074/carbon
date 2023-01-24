/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function KafkaStreamSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.kafkastreams.titleAccessType')}>
          {span.getIn(['data', 'kafka-streams', 'access'])}
        </Di>
        <Di title={t('in-forge:tracing.kafkastreams.titleFunction')}>
          {span.getIn(['data', 'kafka-streams', 'function'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'kafka-streams', 'error'])} />
      </Dl>
    </div>
  );
}
