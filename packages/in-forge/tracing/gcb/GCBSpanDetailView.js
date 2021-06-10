/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function GCBSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.gcb.titleOperation')}>{span.getIn(['data', 'gcb', 'op'])}</Di>
        <Di title={t('in-forge:tracing.gcb.titleTable')}>{span.getIn(['data', 'gcb', 'table'])}</Di>
        <Di title={t('in-forge:tracing.gcb.titleKey')}>{span.getIn(['data', 'gcb', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'gcb', 'error'])} />
      </Dl>
    </div>
  );
}
