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

export default function MySQLiSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'mysqli', 'stmt']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.mysqli.titleDSN')}>{span.getIn(['data', 'mysqli', 'dsn'])}</Di>
        {statement ? (
          <Di title={t('in-forge:tracing.mysqli.titleQuery')} verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
        <ErrorDescriptionItem error={span.getIn(['data', 'mysqli', 'error'])} />
      </Dl>
    </div>
  );
}
