/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function SequelSpanGroupingDetailView({ span }) {
  const sql = span.getIn(['data', 'sequel', 'sql']);
  if (!sql) {
    return null;
  }

  return (
    <Dl>
      <Di title={t('in-forge:tracing.sequel.sql')} verticalDisplay>
        <Code code={formatSql(sql)} lang="sql" showLineNumbers={false} />
      </Di>
    </Dl>
  );
}
