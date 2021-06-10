/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function RabbitMqSpanDetailView({ span }) {
  const exchange = span.getIn(['data', 'rabbitmq', 'exchange']);
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.rabbitmq.sort')}>{span.getIn(['data', 'rabbitmq', 'sort'])}</Di>
        <Di title={t('in-forge:tracing.rabbitmq.exchange')}>{isBlank(exchange) ? '<default exchange>' : exchange}</Di>
        <Di title={t('in-forge:tracing.rabbitmq.key')}>{span.getIn(['data', 'rabbitmq', 'key'])}</Di>
        <Di title={t('in-forge:tracing.rabbitmq.size')}>{span.getIn(['data', 'rabbitmq', 'size'])}</Di>
      </Dl>
    </div>
  );
}
