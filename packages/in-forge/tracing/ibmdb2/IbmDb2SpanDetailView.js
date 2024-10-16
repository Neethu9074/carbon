/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ExternalIntegrationLink from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/ExternalIntegrationLink';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function IbmDb2SpanDetailView({ span }) {
  const statement = span.getIn(['data', 'db2', 'stmt']);
  const databaseIntegrations = span.getIn(['data', 'databaseIntegrations']).toJS();

  return (
    <div>
      <Dl>
        {statement ? (
          <Di title={t('in-forge:tracing.ibmdb2.titleQuery')} verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
        {databaseIntegrations && <ExternalIntegrationLink integrations={databaseIntegrations} statement={statement} />}
      </Dl>
    </div>
  );
}
