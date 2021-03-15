/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function RenderSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.render.type')}>{span.getIn(['data', 'render', 'type'])}</Di>
      <Di title={t('in-forge:tracing.render.name')}>{span.getIn(['data', 'render', 'name'])}</Di>
      <Di title={t('in-forge:tracing.render.errorMessage')}>{span.getIn(['data', 'log', 'message'])}</Di>
      <Di title={t('in-forge:tracing.render.errorType')}>{span.getIn(['data', 'log', 'parameters'])}</Di>
    </Dl>
  );
}
