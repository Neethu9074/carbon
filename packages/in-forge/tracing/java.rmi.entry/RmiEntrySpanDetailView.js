/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function RmiEntrySpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.javaRmiEntry.titleMethod')}>{span.getIn(['data', 'rmi', 'method'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'rmi', 'error'])} />
    </Dl>
  );
}
