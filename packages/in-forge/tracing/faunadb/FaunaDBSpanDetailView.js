/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function FaunaDBSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.faunadb.titleQuery')}>{span.getIn(['data', 'faunadb', 'query'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'faunadb', 'error'])} />
      </Dl>
    </div>
  );
}
