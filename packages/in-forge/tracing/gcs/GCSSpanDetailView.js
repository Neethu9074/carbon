/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function GCSSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.gcs.titleGCSOperation')}>{span.getIn(['data', 'gcs', 'op'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSBucket')}>{span.getIn(['data', 'gcs', 'bucket'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSSourceBucket')}>{span.getIn(['data', 'gcs', 'sourceBucket'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSSourceObject')}>{span.getIn(['data', 'gcs', 'sourceObject'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSObject')}>{span.getIn(['data', 'gcs', 'object'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSDestinationBucket')}>
          {span.getIn(['data', 'gcs', 'destinationBucket'])}
        </Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSDestinationObject')}>
          {span.getIn(['data', 'gcs', 'destinationObject'])}
        </Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSRange')}>{span.getIn(['data', 'gcs', 'range'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSNumberOfOperations')}>
          {span.getIn(['data', 'gcs', 'numberOfOperations'])}
        </Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSEntity')}>{span.getIn(['data', 'gcs', 'entity'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSProjectId')}>{span.getIn(['data', 'gcs', 'projectId'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSAccessId')}>{span.getIn(['data', 'gcs', 'accessId'])}</Di>
        <Di title={t('in-forge:tracing.gcs.titleGCSKey')}>{span.getIn(['data', 'gcs', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'gcs', 'error'])} />
      </Dl>
    </div>
  );
}
