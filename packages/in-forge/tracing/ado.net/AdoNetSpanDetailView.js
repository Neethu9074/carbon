/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'ado', 'command']);
  const error = span.getIn(['data', 'ado', 'error']);
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.adonet.connection')}>{span.getIn(['data', 'ado', 'connection'])}</Di>
        <Di title={t('in-forge:tracing.adonet.commandType')}>{span.getIn(['data', 'ado', 'type'])}</Di>
        {statement ? (
          <Di title={t('in-forge:tracing.adonet.statement')} verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
        <Di title={t('in-forge:tracing.adonet.resultSize')}>{span.getIn(['data', 'ado', 'resultsize'])}</Di>
        <ErrorDescriptionItem error={error} />
      </Dl>
    </div>
  );
}
