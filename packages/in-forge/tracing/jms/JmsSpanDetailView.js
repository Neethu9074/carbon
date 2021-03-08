/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function JmsSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.jms.titleDestination')}>{span.getIn(['data', 'jms', 'destination'])}</Di>
        <Di title={t('in-forge:tracing.jms.titleMessage')}>{span.getIn(['data', 'jms', 'message'])}</Di>
        <Di title={t('in-forge:tracing.jms.titleType')}>{span.getIn(['data', 'jms', 'type'])}</Di>
        <Di title={t('in-forge:tracing.jms.titleSelector')}>{span.getIn(['data', 'jms', 'selector'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'jms', 'error'])} />
      </Dl>
    </div>
  );
}
