/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function JavamailSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.javamail.method')}>{span.getIn(['data', 'mail', 'type'])}</Di>
        <Di title={t('in-forge:tracing.javamail.endpoint')}>{span.getIn(['data', 'mail', 'endpoint'])}</Di>
        <Di title={t('in-forge:tracing.javamail.error')}>{span.getIn(['data', 'mail', 'error'])}</Di>
      </Dl>
    </div>
  );
}
