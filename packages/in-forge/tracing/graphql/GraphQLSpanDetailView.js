/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';
import { fromJS, Map } from 'immutable';

import { HttpSpanDetailViewDescriptionList } from 'in-forge/tracing/http/HttpSpanDetailView';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function GraphQLSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.graphql.titleOperationType')}>
        {span.getIn(['data', 'graphql', 'operationType'])}
      </Di>
      <Di title={t('in-forge:tracing.graphql.titleOperationName')}>
        {span.getIn(['data', 'graphql', 'operationName'])}
      </Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'graphql', 'errors'])} />
      {getObjectTypeDetails(span)}
      {span.getIn(['data', 'http']) && <HttpSpanDetailViewDescriptionList span={span} />}
    </Dl>
  );
}

function getObjectTypeDetails(span) {
  const allFields = deserializeJsonIfNecessary(span.getIn(['data', 'graphql', 'fields'], emptyMap));
  const allArgs = deserializeJsonIfNecessary(span.getIn(['data', 'graphql', 'args'], emptyMap));
  const objectTypes = allFields.keySeq().concat(allArgs.keySeq()).sort().toSet();

  return objectTypes
    .map(objectType => {
      const fieldsPerObjectType = allFields.get(objectType);
      const argsPerObjectType = allArgs.get(objectType);
      let content;
      if (fieldsPerObjectType.size === 0 && argsPerObjectType.size === 0) {
        content = valueMissingPlaceholder;
      } else if (fieldsPerObjectType.size > 0 && argsPerObjectType.size === 0) {
        content = (
          <Fragment>
            <em>Fields</em>: {fieldsPerObjectType.join(', ')}
          </Fragment>
        );
      } else if (fieldsPerObjectType.size === 0 && argsPerObjectType.size > 0) {
        content = (
          <Fragment>
            <em>Arguments</em>: {argsPerObjectType.join(', ')}
          </Fragment>
        );
      } else {
        content = (
          <Fragment>
            <em>Fields:</em> {fieldsPerObjectType.join(', ')}
            <br />
            <em>Arguments:</em> {argsPerObjectType.join(', ')}
          </Fragment>
        );
      }
      return (
        <Di title={t('in-forge:tracing.graphql.titleObjectType', { typeOfObject: objectType })} key={`${objectType}`}>
          {content}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}

function deserializeJsonIfNecessary(value) {
  if (Map.isMap(value)) {
    return value;
  } else if (typeof value === 'string') {
    // The Java tracer sends these values as a serialized JSON string instead of a proper JSON object structure.
    try {
      return fromJS(JSON.parse(value));
    } catch (e) {
      // ignore silently
      return emptyMap;
    }
  } else {
    // only objects and strings are supported
    return emptyMap;
  }
}
