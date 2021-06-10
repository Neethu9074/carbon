/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function CouchbaseSpanDetailView({ span }) {
  const sql = span.getIn(['data', 'couchbase', 'sql']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.couchbase.titleHostname')}>{span.getIn(['data', 'couchbase', 'hostname'])}</Di>
        <Di title={t('in-forge:tracing.couchbase.titleBucket')}>{span.getIn(['data', 'couchbase', 'bucket'])}</Di>
        <Di title={t('in-forge:tracing.couchbase.titleType')}>{span.getIn(['data', 'couchbase', 'type'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'couchbase', 'error'])} />
        <Di title={t('in-forge:tracing.couchbase.titleErrorCode')}>
          {span.getIn(['data', 'couchbase', 'error_code'])}
        </Di>

        {sql ? (
          <Di title={t('in-forge:tracing.couchbase.titleSQL')} verticalDisplay>
            <Code code={formatSql(sql)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}
