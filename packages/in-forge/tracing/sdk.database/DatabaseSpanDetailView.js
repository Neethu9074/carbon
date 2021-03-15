/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import { t } from 'in-i18n';

export default function DatabaseSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.sdkDatabase.instance')}>{span.getIn(['data', 'db', 'instance'])}</Di>
        <Di title={t('in-forge:tracing.sdkDatabase.type')}>{span.getIn(['data', 'db', 'type'])}</Di>
        <Di title={t('in-forge:tracing.sdkDatabase.user')}>{span.getIn(['data', 'db', 'user'])}</Di>

        <Statement span={span} />
      </Dl>
    </div>
  );
}

function Statement({ span }) {
  const statement = span.getIn(['data', 'db', 'statement']);
  if (!statement) {
    return null;
  }

  let lang = 'plain';
  let code = statement;

  if (span.getIn(['data', 'db', 'type']) === 'sql' || span.getIn(['data', 'db', 'type']) === 'clickhouse') {
    lang = 'sql';
    code = formatSql(statement);
  } else if (typeof statement === 'object') {
    lang = 'json';
    code = JSON.stringify(statement, 0, 2);
  } else {
    try {
      code = JSON.stringify(JSON.parse(statement), 0, 2);
      lang = 'json';
    } catch (e) {
      // we have no idea what kind of data the users are providing for the statement. It is just a guess that this
      // might be JSON (for Elasticsearch or Mongo)
    }
  }

  return (
    <Di title={t('in-forge:tracing.sdkDatabase.statement')} verticalDisplay>
      <Code code={code} lang={lang} showLineNumbers={false} />
    </Di>
  );
}
