/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function NatsSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.nats.sort')}>{span.getIn(['data', 'nats', 'sort'])}</Di>
        <Di title={t('in-forge:tracing.nats.subject')}>{span.getIn(['data', 'nats', 'subject'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'nats', 'error'])} />
      </Dl>
    </div>
  );
}
