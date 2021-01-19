/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';

export default function GCSSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="GCS operation">{span.getIn(['data', 'gcs', 'op'])}</Di>
        <Di title="GCS bucket">{span.getIn(['data', 'gcs', 'bucket'])}</Di>
        <Di title="GCS source bucket">{span.getIn(['data', 'gcs', 'sourceBucket'])}</Di>
        <Di title="GCS source object">{span.getIn(['data', 'gcs', 'sourceObject'])}</Di>
        <Di title="GCS object">{span.getIn(['data', 'gcs', 'object'])}</Di>
        <Di title="GCS destination bucket">{span.getIn(['data', 'gcs', 'destinationBucket'])}</Di>
        <Di title="GCS destination object">{span.getIn(['data', 'gcs', 'destinationObject'])}</Di>
        <Di title="GCS range">{span.getIn(['data', 'gcs', 'range'])}</Di>
        <Di title="GCS number of operations">{span.getIn(['data', 'gcs', 'numberOfOperations'])}</Di>
        <Di title="GCS entity">{span.getIn(['data', 'gcs', 'entity'])}</Di>
        <Di title="GCS project id">{span.getIn(['data', 'gcs', 'projectId'])}</Di>
        <Di title="GCS access id">{span.getIn(['data', 'gcs', 'accessId'])}</Di>
        <Di title="GCS key">{span.getIn(['data', 'gcs', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'gcs', 'error'])} />
      </Dl>
    </div>
  );
}
