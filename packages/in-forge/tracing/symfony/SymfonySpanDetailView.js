/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';

export default function SymfonySpanDetailView({ span }) {
  const routeParams = getParamsForFormatting(span);

  return (
    <div>
      <Dl>
        <Di title="Route">{span.getIn(['data', 'symfony', 'route'])}</Di>
        <Di title="Controller">{span.getIn(['data', 'symfony', 'controller'])}</Di>
        <Di title="Action">{span.getIn(['data', 'symfony', 'action'])}</Di>

        <Di title="API Collection Operation">{span.getIn(['data', 'symfony', 'api_collection_operation'])}</Di>
        <Di title="API Item Operation">{span.getIn(['data', 'symfony', 'api_item_operation'])}</Di>
        <Di title="API Subresource Operation">{span.getIn(['data', 'symfony', 'api_subresource_operation_name'])}</Di>
        <Di title="API Resource">{span.getIn(['data', 'symfony', 'api_resource_class'])}</Di>

        {routeParams ? (
          <Di title="Route Parameters" verticalDisplay>
            <Code code={routeParams} lang="json" />
          </Di>
        ) : null}
        <Di title="Event Count">{span.getIn(['data', 'symfony', 'event_count'])}</Di>
        <ErrorDescriptionItem error={span.getIn(['data', 'symfony', 'exception'])} />
      </Dl>
    </div>
  );
}

function getParamsForFormatting(span) {
  let query = '';

  const params = span.getIn(['data', 'symfony', 'route_params']);
  if (params) {
    try {
      query += JSON.stringify(JSON.parse(params), 0, 2);
    } catch (e) {
      // ignore command parsing errors
      query += params;
    }
  }

  if (query.length > 0) {
    return query.trim();
  }

  return null;
}
