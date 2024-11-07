/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import { useHrefToBusinessProcess, useHrefToBusinessActivity } from 'in-bizops/navigation/paths';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function BPMSpanDetailView({ span }) {
  // Creates new businessItem Object type from span Map type
  const businessItem = Object.fromEntries(span.get('data'));
  const process = Object.fromEntries(businessItem?.process) ?? {};
  const activity = Object.fromEntries(businessItem?.activity) ?? {};

  // BPM span keys can be found in BPMSpanKeys.java in the java-tracer repo
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.bpm.titleProcessDefinitionId')} key={'processDefinitionId'}>
          {process.definitionId}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleProcessName')} key={'processName'}>
          <Link href={useHrefToBusinessProcess(process)}>{process.name}</Link>
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleBusinessKey')} key={'processBusinessKey'}>
          {process.businessKey}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleRootProcessUUID')} key={'rootProcessId'}>
          {businessItem?.rootProcess?.id}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityId')} key={'activityId'}>
          {activity.id}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityName')} key={'activityName'}>
          <Link href={useHrefToBusinessActivity({ process, activity })}>{activity.name}</Link>
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityDesc')} key={'activityDescription'}>
          {activity.description}
        </Di>
        <Di title={t('in-forge:tracing.bpm.titleActivityType')} key={'activityType'}>
          {activity.type}
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
      return (
        <Di title={t('in-forge:tracing.bpm.titleBusinessVariable', { businessVariableKey: `bpm-${k}` })} key={k}>
          {v}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}
