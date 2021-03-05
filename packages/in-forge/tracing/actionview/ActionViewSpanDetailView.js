/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function ActionViewSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.actionview.errorMessage')}>{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title={t('in-forge:tracing.actionview.errorType')}>{span.getIn(['data', 'log', 'parameters'])}</Di>
    </Dl>
  );
}
