/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function NatsStreamingSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.natsStreaming.sort')}>{span.getIn(['data', 'nats', 'sort'])}</Di>
        <Di title={t('in-forge:tracing.natsStreaming.subject')}>{span.getIn(['data', 'nats', 'subject'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'nats', 'error'])} />
      </Dl>
    </div>
  );
}
