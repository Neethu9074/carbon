/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import Code from 'in-sdk/components/traceDetails/Code';

export default function IbmDb2SpanDetailView({ span }) {
  const statement = span.getIn(['data', 'db2', 'stmt']);

  return (
    <div>
      <Dl>
        {statement ? (
          <Di title={t('in-forge:tracing.ibmdb2.titleQuery')} verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}
