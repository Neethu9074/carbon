/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ExternalIntegrationLink from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/ExternalIntegrationLink';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function PostgresSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'pg', 'stmt'], span.getIn(['data', 'pg', 'sql']));
  const databaseIntegrations = span.getIn(['data', 'databaseIntegrations']).toJS();

  return (
    <Dl>
      <Di title={t('in-forge:tracing.postgres.host')}>{span.getIn(['data', 'pg', 'host'])}</Di>
      <Di title={t('in-forge:tracing.postgres.port')}>{span.getIn(['data', 'pg', 'port'])}</Di>
      <Di title={t('in-forge:tracing.postgres.database')}>{span.getIn(['data', 'pg', 'db'])}</Di>
      <Di title={t('in-forge:tracing.postgres.user')}>{span.getIn(['data', 'pg', 'user'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'pg', 'error'])} />

      {statement ? (
        <Di title={t('in-forge:tracing.postgres.query')} verticalDisplay>
          <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
        </Di>
      ) : null}
      {databaseIntegrations && <ExternalIntegrationLink integrations={databaseIntegrations} statement={statement} />}
    </Dl>
  );
}
