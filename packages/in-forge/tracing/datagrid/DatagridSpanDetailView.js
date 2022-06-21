/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function DatagridSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.datagrid.titleClusterName')}>
          {span.getIn(['data', 'datagrid', 'clusterName'])}
        </Di>
        <Di title={t('in-forge:tracing.datagrid.titleCacheName')}>{span.getIn(['data', 'datagrid', 'cacheName'])}</Di>
        <Di title={t('in-forge:tracing.datagrid.titleOperation')}>{span.getIn(['data', 'datagrid', 'operation'])}</Di>
        <Di title={t('in-forge:tracing.datagrid.titleKey')}>{span.getIn(['data', 'datagrid', 'key'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'datagrid', 'error'])} />
      </Dl>
    </div>
  );
}
