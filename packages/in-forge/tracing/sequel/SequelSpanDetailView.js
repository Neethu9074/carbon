/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function SequelSpanDetailView({ span }) {
  const sql = span.getIn(['data', 'sequel', 'sql']);

  return (
    <Dl>
      <Di title={t('in-forge:tracing.sequel.adapter')}>{span.getIn(['data', 'sequel', 'adapter'])}</Di>
      <Di title={t('in-forge:tracing.sequel.database')}>{span.getIn(['data', 'sequel', 'db'])}</Di>
      <Di title={t('in-forge:tracing.sequel.databaseHost')}>{span.getIn(['data', 'sequel', 'host'])}</Di>
      <Di title={t('in-forge:tracing.sequel.username')}>{span.getIn(['data', 'sequel', 'username'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'sequel', 'error'])} />

      {sql ? (
        <Di title={t('in-forge:tracing.sequel.sql')} verticalDisplay>
          <Code code={formatSql(sql)} lang="sql" showLineNumbers={false} />
        </Di>
      ) : null}
    </Dl>
  );
}
