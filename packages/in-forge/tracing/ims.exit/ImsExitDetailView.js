/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ImsExitDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.ims.titleHostname')}>{span.getIn(['data', 'imsexit', 'host'])}</Di>
        <Di title={t('in-forge:tracing.ims.titlePort')}>{span.getIn(['data', 'imsexit', 'port'])}</Di>
        <Di title={t('in-forge:tracing.ims.titleDatastore')}>{span.getIn(['data', 'imsexit', 'dsn'])}</Di>
        <Di title={t('in-forge:tracing.ims.titleInteractionVerb')}>{span.getIn(['data', 'imsexit', 'iVerb'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'imsexit', 'error'])} />
      </Dl>
    </div>
  );
}
