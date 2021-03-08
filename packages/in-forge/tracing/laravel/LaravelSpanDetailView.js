/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function LaravelSpanDetailView({ span }) {
  const route = span.getIn(['data', 'laravel', 'route']);
  const action = span.getIn(['data', 'laravel', 'action']);
  const controller = span.getIn(['data', 'laravel', 'controller']);

  return (
    <div>
      <Dl>
        {route != null && <Di title={t('in-forge:tracing.laravel.titleRoute')}>{route}</Di>}
        {controller != null && <Di title={t('in-forge:tracing.laravel.titleController')}>{controller}</Di>}
        {action != null && <Di title={t('in-forge:tracing.laravel.titleAction')}>{action}</Di>}
        <ErrorDescriptionItem error={span.getIn(['data', 'laravel', 'exception'])} />
      </Dl>
    </div>
  );
}
