/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function S3SpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.s3.region')}>{span.getIn(['data', 's3', 'region'])}</Di>
        <Di title={t('in-forge:tracing.s3.bucket')}>{span.getIn(['data', 's3', 'bucket'])}</Di>
        <Di title={t('in-forge:tracing.s3.operation')}>{span.getIn(['data', 's3', 'op'])}</Di>
        <Di title={t('in-forge:tracing.s3.key')}>{span.getIn(['data', 's3', 'key'])}</Di>
        <Di title={t('in-forge:tracing.s3.exists')}>{span.getIn(['data', 's3', 'exists'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 's3', 'error'])} />
      </Dl>
    </div>
  );
}
