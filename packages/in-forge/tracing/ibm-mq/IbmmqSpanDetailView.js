/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function IbmmqSpanDetailView({ span }) {
  const operation = span.getIn(['data', 'ibm-mq', 'operation']);
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.ibmmq.titleDestination')}>
          {operation == 'PUT'
            ? span.getIn(['data', 'ibm-mq', 'queue'])
            : span.getIn(['data', 'sdk', 'custom', 'tags', 'exitContextApplName'])}
        </Di>
        {operation == 'PUT' ? (
          <Di title={t('in-forge:tracing.ibmmq.titleDestinationKind')}>
            {span.getIn(['data', 'ibm-mq', 'destination', 'kind'], 'queue')}
          </Di>
        ) : null}
        <Di title={t('in-forge:tracing.ibmmq.titleMsgOperation')}>
          {span.getIn(['data', 'sdk', 'custom', 'tags', 'spanType'])}
        </Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'sdk', 'custom', 'tags', 'error'])} />
      </Dl>
    </div>
  );
}
