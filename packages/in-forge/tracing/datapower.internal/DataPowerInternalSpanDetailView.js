/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function DataPowerInternalSpanDetailView({ span }) {
  return (
   <>
      <Dl>
        <Di title={t('in-forge:tracing.ibmdatapower.titleOperationName')}>
          {span.getIn(['data', 'sdk', 'custom', 'tags', 'operationName'])}
        </Di>
        <Di title={t('in-forge:tracing.ibmdatapower.titleObjectName')}>
          {span.getIn(['data', 'sdk', 'custom', 'tags', 'objectName'])}
        </Di>
        <Di title={t('in-forge:tracing.ibmdatapower.titleObjectType')}>
          {span.getIn(['data', 'sdk', 'custom', 'tags', 'objectType'])}
        </Di>
      </Dl>
    </div>
  );
}
