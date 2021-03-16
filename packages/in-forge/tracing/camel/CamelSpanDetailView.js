/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function CamelSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.camel.titleType')}>{span.getIn(['data', 'camel', 'type'])}</Di>
        <Di title={t('in-forge:tracing.camel.titleQuartz')}>{span.getIn(['data', 'camel', 'quartz'])}</Di>
        <Di title={t('in-forge:tracing.camel.titleTimer')}>{span.getIn(['data', 'camel', 'timer'])}</Di>
        <Di title={t('in-forge:tracing.camel.titleSort')}>{span.getIn(['data', 'camel', 'sort'])}</Di>
        <Di title={t('in-forge:tracing.camel.titleSize')}>{span.getIn(['data', 'camel', 'size'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'camel', 'error'])} />
      </Dl>
    </div>
  );
}
