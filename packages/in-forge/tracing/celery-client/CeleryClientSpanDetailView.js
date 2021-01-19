/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';

export default function CeleryClientSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Celery Task">{span.getIn(['data', 'celery', 'task'])}</Di>
      <Di title="Celery Task ID">{span.getIn(['data', 'celery', 'task_id'])}</Di>
      <Di title="Retry Reason">{span.getIn(['data', 'celery', 'retry-reason'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'celery', 'error'])} />
    </Dl>
  );
}
