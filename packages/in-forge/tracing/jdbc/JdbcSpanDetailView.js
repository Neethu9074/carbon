/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);
  const connection = span.getIn(['data', 'jdbc', 'connection']);

  return (
    <div>
      <Dl>
        <ErrorDescriptionItem error={span.getIn(['data', 'jdbc', 'error'])} />

        {statement && (
          <Di title={t('in-forge:tracing.jdbc.titleStatement')} verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        )}

        {connection && (
          <Di title={t('in-forge:tracing.jdbc.titleConnection')} verticalDisplay>
            <Code softWrap code={connection} showLineNumbers={false} />
          </Di>
        )}
        <Di title={t('in-forge:tracing.jdbc.titleUser')}>{span.getIn(['data', 'jdbc', 'user'])}</Di>
        <Di title={t('in-forge:tracing.jdbc.titleTimeout')}>{span.getIn(['data', 'jdbc', 'timeout'])}</Di>
        <Di title={t('in-forge:tracing.jdbc.titleResultSize')}>{span.getIn(['data', 'jdbc', 'size'])}</Di>
      </Dl>
    </div>
  );
}
