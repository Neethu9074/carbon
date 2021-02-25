/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SnsSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.sns.topic')}>{span.getIn(['data', 'sns', 'topic'])}</Di>
        <Di title={t('in-forge:tracing.sns.target')}>{span.getIn(['data', 'sns', 'target'])}</Di>
        <Di title={t('in-forge:tracing.sns.phone')}>{span.getIn(['data', 'sns', 'phone'])}</Di>
        <Di title={t('in-forge:tracing.sns.subject')}>{span.getIn(['data', 'sns', 'subject'])}</Di>
        <Di title={t('in-forge:tracing.sns.responseCode')}>{span.getIn(['data', 'sns', 'responseCode'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sns', 'error'])} />
      </Dl>
    </div>
  );
}
