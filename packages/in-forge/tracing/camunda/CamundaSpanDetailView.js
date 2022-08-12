/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function CamundaSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.camunda.titleProcessId')}>{span.getIn(['data', 'process', 'id'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleProcessName')}>{span.getIn(['data', 'process', 'name'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleBusinessKey')}>{span.getIn(['data', 'process', 'businessKey'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleCaseIntanceId')}>
          {span.getIn(['data', 'process', 'caseInstanceId'])}
        </Di>
        <Di title={t('in-forge:tracing.camunda.titleRootProcessUUID')}>{span.getIn(['data', 'rootProcess', 'id'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleActivityId')}>{span.getIn(['data', 'activity', 'id'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleActivityName')}>{span.getIn(['data', 'activity', 'name'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleActivityDesc')}>{span.getIn(['data', 'activity', 'desc'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleExternalTaskId')}>{span.getIn(['data', 'externalTask', 'id'])}</Di>
        <Di title={t('in-forge:tracing.camunda.titleExternalTaskWorkerId')}>
          {span.getIn(['data', 'externalTask', 'workerId'])}
        </Di>
        <Di title={t('in-forge:tracing.camunda.titleExternalTaskTopic')}>
          {span.getIn(['data', 'externalTask', 'topic'])}
        </Di>
        <Di title={t('in-forge:tracing.camunda.titleExternalTaskRetries')}>
          {span.getIn(['data', 'externalTask', 'retries'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'camunda', 'error'])} />
      </Dl>
    </div>
  );
}
