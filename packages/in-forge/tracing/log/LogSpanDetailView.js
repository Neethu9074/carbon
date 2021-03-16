/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function LogSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.log.titleLevel')}>{span.getIn(['data', 'log', 'level'])}</Di>
      <Di title={t('in-forge:tracing.log.titleLogger')}>{span.getIn(['data', 'log', 'logger'])}</Di>
      <Di title={t('in-forge:tracing.log.titleMessage')}>{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title={t('in-forge:tracing.log.titleParameters')}>{span.getIn(['data', 'log', 'parameters'])}</Di>
      <Di title={t('in-forge:tracing.log.titleThread')}>{span.getIn(['data', 'log', 'thread'])}</Di>
    </Dl>
  );
}
