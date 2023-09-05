/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function SolaceSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.solace.destination')}>{span.getIn(['data', 'solace', 'destination'])}</Di>
        <Di title={t('in-forge:tracing.solace.operation')}>{span.getIn(['data', 'solace', 'op'])}</Di>
        <Di title={t('in-forge:tracing.solace.applicationMessageId')}>
          {span.getIn(['data', 'solace', 'application', 'messageId'])}
        </Di>
        <Di title={t('in-forge:tracing.solace.applicationMessageType')}>
          {span.getIn(['data', 'solace', 'application', 'messageType'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'solace', 'error'])} />
      </Dl>
    </div>
  );
}
