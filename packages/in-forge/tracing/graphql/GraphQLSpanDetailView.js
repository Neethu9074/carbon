import React, { Fragment } from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';

export default function GraphQLSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title="Operation Type">{span.getIn(['data', 'graphql', 'operationType'])}</Di>
      <Di title="Operation Name">{span.getIn(['data', 'graphql', 'operationName'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'graphql', 'errors'])} />
      {getObjectTypeDetails(span)}
    </Dl>
  );
}

function getObjectTypeDetails(span) {
  const allFields = span.getIn(['data', 'graphql', 'fields'], emptyMap);
  const allArgs = span.getIn(['data', 'graphql', 'args'], emptyMap);
  const objectTypes = allFields
    .keySeq()
    .concat(allArgs.keySeq())
    .sort()
    .toSet();
  return objectTypes
    .map(objectType => {
      const fieldsPerObjectType = allFields.get(objectType);
      const argsPerObjectType = allArgs.get(objectType);
      let content;
      if (!fieldsPerObjectType && !argsPerObjectType) {
        content = valueMissingPlaceholder;
      } else if (fieldsPerObjectType && !argsPerObjectType) {
        content = (
          <Fragment>
            <em>Fields</em>: {fieldsPerObjectType.join(', ')}
          </Fragment>
        );
      } else if (!fieldsPerObjectType && argsPerObjectType) {
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
        <Di title={`Object Type "${objectType}"`} key={`${objectType}`}>
          {content}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}
