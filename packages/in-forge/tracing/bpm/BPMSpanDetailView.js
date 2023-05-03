/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function BPMSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.bpm.titleProcessId')}>{span.getIn(['data', 'process', 'id'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleProcessName')}>{span.getIn(['data', 'process', 'name'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleBusinessKey')}>{span.getIn(['data', 'process', 'businessKey'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleCaseIntanceId')}>
          {span.getIn(['data', 'process', 'caseInstanceId'])}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleRootProcessUUID')}>{span.getIn(['data', 'rootProcess', 'id'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityId')}>{span.getIn(['data', 'activity', 'id'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityName')}>{span.getIn(['data', 'activity', 'name'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityDesc')}>{span.getIn(['data', 'activity', 'desc'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityType')}>{span.getIn(['data', 'activity', 'type'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleExternalTaskId')}>{span.getIn(['data', 'externalTask', 'id'])}</Di>
        <Di title={t('in-forge:tracing.bpm.titleExternalTaskWorkerId')}>
          {span.getIn(['data', 'externalTask', 'workerId'])}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleExternalTaskTopic')}>
          {span.getIn(['data', 'externalTask', 'topic'])}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleExternalTaskRetries')}>
          {span.getIn(['data', 'externalTask', 'retries'])}
        </Di>
        {getBusinessVariables(span)}
        <ErrorDescriptionItem error={span.getIn(['data', 'bpm', 'error'])} />
      </Dl>
    </div>
  );
}
function getBusinessVariables(span) {
  return span
    .getIn(['data', 'bpm', 'variable'], emptyMap)
    .map((v, k) => {
      return <Di title={t('in-forge:tracing.bpm.titleBusinessVariable', { businessVariableKey: `bpm-${k}` })}>{v}</Di>;
    })
    .valueSeq()
    .toArray();
}
