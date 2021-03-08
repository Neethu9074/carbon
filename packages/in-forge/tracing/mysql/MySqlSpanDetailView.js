/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';

export default function MySqlSpanDetailView({ span }) {
  const statement = span.getIn(['data', 'mysql', 'stmt'], span.getIn(['data', 'mysql', 'sql']));

  return (
    <Dl>
      <Di title={t('in-forge:tracing.mysql.titleHost')}>{span.getIn(['data', 'mysql', 'host'])}</Di>
      <Di title={t('in-forge:tracing.mysql.titlePort')}>{span.getIn(['data', 'mysql', 'port'])}</Di>
      <Di title={t('in-forge:tracing.mysql.titleDatabase')}>{span.getIn(['data', 'mysql', 'db'])}</Di>
      <Di title={t('in-forge:tracing.mysql.titleUser')}>{span.getIn(['data', 'mysql', 'user'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'mysql', 'error'])} />

      {statement ? (
        <Di title={t('in-forge:tracing.mysql.titleQuery')} verticalDisplay>
          <Code code={formatSql(statement)} lang="sql" showLineNumbers={false} />
        </Di>
      ) : null}
    </Dl>
  );
}
