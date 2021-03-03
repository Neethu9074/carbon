/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function AmqpSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.amqp.command')}>{span.getIn(['data', 'amqp', 'command'])}</Di>
        <Di title={t('in-forge:tracing.amqp.connection')}>{span.getIn(['data', 'amqp', 'connection'])}</Di>
        <Di title={t('in-forge:tracing.amqp.routingKey')}>{span.getIn(['data', 'amqp', 'routingkey'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'amqp', 'error'])} />
      </Dl>
    </div>
  );
}
