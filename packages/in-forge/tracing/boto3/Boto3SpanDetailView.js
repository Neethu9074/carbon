/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { expandNestedSerializedJson } from 'in-services/util/json';
import Code from 'in-sdk/components/traceDetails/Code';

export default function Boto3SpanDetailView({ span }) {
  const payload = span.getIn(['data', 'boto3', 'payload']);

  return (
    <Dl>
      <Di title={t('in-forge:tracing.boto3.titleOperation')}>{span.getIn(['data', 'boto3', 'op'])}</Di>
      <Di title={t('in-forge:tracing.boto3.titleEndpoint')}>{span.getIn(['data', 'boto3', 'ep'])}</Di>
      <Di title={t('in-forge:tracing.boto3.titleRegion')}>{span.getIn(['data', 'boto3', 'reg'])}</Di>
      <Di title={t('in-forge:tracing.boto3.titleStatus')}>{span.getIn(['data', 'http', 'status'])}</Di>

      {payload && (
        <Di title={t('in-forge:tracing.boto3.titlePayload')} verticalDisplay>
          <Code code={JSON.stringify(expandNestedSerializedJson(payload.toJS()), 0, 2)} lang="json" />
        </Di>
      )}

      <ErrorDescriptionItem error={span.getIn(['data', 'boto3', 'error'])} />
    </Dl>
  );
}
