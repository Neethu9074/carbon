/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function CamundaExitSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.camunda-exit.titleExternalTaskTopic')}>
          {span.getIn(['data', 'externalTask', 'topic'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'camunda', 'error'])} />
      </Dl>
    </div>
  );
}
