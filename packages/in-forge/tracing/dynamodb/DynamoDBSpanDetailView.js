/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function DynamoDBSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.dynamoDB.titleTable')}>{span.getIn(['data', 'dynamodb', 'table'])}</Di>
        <Di title={t('in-forge:tracing.dynamoDB.titleOperation')}>{span.getIn(['data', 'dynamodb', 'op'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'dynamodb', 'error'])} />
      </Dl>
    </div>
  );
}
