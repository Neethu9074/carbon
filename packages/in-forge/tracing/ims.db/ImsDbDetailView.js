/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function ImsDbDetailView({ span }) {
  const statement = span.getIn(['data', 'imsdb', 'stmt']);

  return (
    <div>
      <Dl>
        {statement ? (
          <Di title={t('in-forge:tracing.jdbc.titleStatement')} verticalDisplay>
            <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
          </Di>
        ) : null}
        <ErrorDescriptionItem error={span.getIn(['data', 'imsdb', 'error'])} />
      </Dl>
    </div>
  );
}
