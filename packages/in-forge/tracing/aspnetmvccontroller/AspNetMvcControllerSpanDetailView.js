/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function WebApiSpanDetailView({ span }) {
  const controller = span.getIn(['data', 'aspnetmvccontroller', 'controller']);
  const error = span.getIn(['data', 'aspnetmvccontroller', 'error']);
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.aspNetMvcController.titleController')}>{controller ? controller : 'unknown'}</Di>
        <Di title={t('in-forge:tracing.aspNetMvcController.titleAction')}>
          {span.getIn(['data', 'aspnetmvccontroller', 'action'])}
        </Di>
        <Di title={t('in-forge:tracing.aspNetMvcController.titleUrl')}>
          {span.getIn(['data', 'aspnetmvccontroller', 'url'])}
        </Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
