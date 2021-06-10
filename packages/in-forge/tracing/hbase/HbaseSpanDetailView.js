/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function HzSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.hbase.titleOperation')}>{span.getIn(['data', 'hbase', 'operation'])}</Di>
        <Di title={t('in-forge:tracing.hbase.titleTable')}>{span.getIn(['data', 'hbase', 'table'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'hbase', 'error'])} />
      </Dl>
    </div>
  );
}
