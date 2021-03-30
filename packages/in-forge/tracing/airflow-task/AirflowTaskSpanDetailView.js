/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function AirflowTaskSpanDetailView({ span }) {
  const data = span.getIn(['data', 'airflow']),
    dagId = data.get('dag_id'),
    taskId = data.get('task_id'),
    execDate = data.get('exec_date');

  return (
    <Dl>
      <Di title={t('in-forge:tracing.airflow.titleDagID')}>{dagId}</Di>
      <Di title={t('in-forge:tracing.airflow.titleTaskID')}>{taskId}</Di>
      <Di title={t('in-forge:tracing.airflow.titleExecutionDate')}>{execDate}</Di>
      <ErrorDescriptionItem error={data.get('error')} />
    </Dl>
  );
}
