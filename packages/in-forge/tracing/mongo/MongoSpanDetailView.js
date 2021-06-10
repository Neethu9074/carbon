/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { t } from 'in-i18n';

export default function MongoSpanDetailView({ span }) {
  const query = getQueryForFormatting(span);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.mongo.titleHostname')}>{span.getIn(['data', 'peer', 'hostname'])}</Di>
        <Di title={t('in-forge:tracing.mongo.titlePort')}>{span.getIn(['data', 'peer', 'port'])}</Di>
        <Di title={t('in-forge:tracing.mongo.titleService')}>{span.getIn(['data', 'mongo', 'service'])}</Di>
        <Di title={t('in-forge:tracing.mongo.titleNamespace')}>{span.getIn(['data', 'mongo', 'namespace'])}</Di>
        {query ? (
          <Di title={t('in-forge:tracing.mongo.titleQuery')} verticalDisplay>
            <Code code={query} lang="json" />
          </Di>
        ) : null}
        <ErrorDescriptionItem error={span.getIn(['data', 'mongo', 'error'])} />
        <Di title={t('in-forge:tracing.mongo.titleErrorCode')}>{span.getIn(['data', 'mongo', 'error_code'])}</Di>
      </Dl>
    </div>
  );
}

function getQueryForFormatting(span) {
  let query = '';

  const commandName = span.getIn(['data', 'mongo', 'command']);
  const command = span.getIn(['data', 'mongo', 'json']);
  const filter = span.getIn(['data', 'mongo', 'filter']);

  if (filter) {
    query += `// Filter:\n`;

    try {
      query += JSON.stringify(JSON.parse(filter), 0, 2);
    } catch (e) {
      // ignore filter parsing errors
      query += filter;
    }

    query += '\n\n';
  }

  if (command) {
    if (commandName) {
      query += `// Command: ${commandName}\n`;
    }

    try {
      query += JSON.stringify(JSON.parse(command), 0, 2);
    } catch (e) {
      // ignore command parsing errors
      query += command;
    }
  }

  if (query.length > 0) {
    return query.trim();
  }
  return null;
}
