/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function JdbcSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'jdbc', 'statement']);
  if (!statement) {
    return null;
  }

  return (
    <Dl>
      <Di title={t('in-forge:tracing.jdbc.titleStatement')} verticalDisplay>
        <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
      </Di>
    </Dl>
  );
}
