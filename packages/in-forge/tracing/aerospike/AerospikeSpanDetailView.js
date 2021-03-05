/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function AerospikeSpanDetailView({ span }) {
  const parameters = span.getIn(['data', 'aerospike', 'parameters']);
  const statement = span.getIn(['data', 'aerospike', 'statement']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.aerospike.namespace')}>{span.getIn(['data', 'aerospike', 'ns'])}</Di>
        <Di title={t('in-forge:tracing.aerospike.setName')}>{span.getIn(['data', 'aerospike', 'setName'])}</Di>
        <Di title={t('in-forge:tracing.aerospike.userKey')}>{span.getIn(['data', 'aerospike', 'userKey'])}</Di>
        <Di title={t('in-forge:tracing.aerospike.Operation')}>{span.getIn(['data', 'aerospike', 'op'])}</Di>
        <Di title={t('in-forge:tracing.aerospike.host')}>{span.getIn(['data', 'aerospike', 'host'])}</Di>
        <Di title={t('in-forge:tracing.aerospike.port')}>{span.getIn(['data', 'aerospike', 'port'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'aerospike', 'error'])} />

        {parameters ? <Di title={t('in-forge:tracing.aerospike.parameters')}>{parameters}</Di> : null}

        {statement ? <Di title={t('in-forge:tracing.aerospike.statement')}>{statement}</Di> : null}
      </Dl>
    </div>
  );
}
