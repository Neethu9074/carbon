/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ActionControllerSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.actioncontroller.controller')}>
        {span.getIn(['data', 'actioncontroller', 'controller'])}
      </Di>
      <Di title={t('in-forge:tracing.actioncontroller.action')}>
        {span.getIn(['data', 'actioncontroller', 'action'])}
      </Di>
      <Di title={t('in-forge:tracing.actioncontroller.errorMessage')}>{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title={t('in-forge:tracing.actioncontroller.errorType')}>{span.getIn(['data', 'log', 'parameters'])}</Di>
    </Dl>
  );
}
