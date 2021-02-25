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

export default function PdoSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'pdo', 'stmt']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.pdo.driver')}>{span.getIn(['data', 'pdo', 'driver'])}</Di>
        <Di title="DSN">{span.getIn(['data', 'pdo', 'dsn'])}</Di>

        {statement ? (
          <Di title={t('in-forge:tracing.pdo.query')} verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}

        <ErrorDescriptionItem error={span.getIn(['data', 'pdo', 'error'])} />
        <Di title={t('in-forge:tracing.pdo.errorCode')}>{span.getIn(['data', 'pdo', 'error_code'])}</Di>
      </Dl>
    </div>
  );
}
