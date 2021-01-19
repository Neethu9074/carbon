/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';

export default function ElasticsearchSpanDetailView({ span }) {
  const query = span.getIn(['data', 'elasticsearch', 'query']);
  return (
    <div>
      <Dl>
        <Di title="Endpoint">{span.getIn(['data', 'elasticsearch', 'endpoint'])}</Di>
        <Di title="Action">{span.getIn(['data', 'elasticsearch', 'action'])}</Di>
        <Di title="Index">{span.getIn(['data', 'elasticsearch', 'index'])}</Di>
        <Di title="Type">{span.getIn(['data', 'elasticsearch', 'type'])}</Di>
        <Di title="ID">{span.getIn(['data', 'elasticsearch', 'id'])}</Di>
        <Di title="Hits">{span.getIn(['data', 'elasticsearch', 'hits'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'elasticsearch', 'error'])} />

        {query ? (
          <Di title="Query" verticalDisplay>
            <Code code={prettyPrintQuery(query)} lang="json" />
          </Di>
        ) : null}
      </Dl>
    </div>
  );
}

function prettyPrintQuery(query) {
  let json;
  try {
    json = JSON.parse(query);
  } catch (e) {
    return query;
  }

  if (json.query_binary) {
    const binaryQuery = json.query_binary;

    try {
      json.query_binary_decoded = atob(binaryQuery);
    } catch (e) {
      // Queries may be trucnated to save space. Decoding
      // is only an optional service.
    }
  }

  return JSON.stringify(json, 0, 2);
}
