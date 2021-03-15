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

export default function Neo4jSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'neo4j', 'stmt']);

  return (
    <Dl>
      <Di title={t('in-forge:tracing.neo4j.connection')}>{span.getIn(['data', 'neo4j', 'conn'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'neo4j', 'error'])} />
      {statement ? (
        <Di title={t('in-forge:tracing.neo4j.statement')} verticalDisplay>
          <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
        </Di>
      ) : null}
    </Dl>
  );
}
