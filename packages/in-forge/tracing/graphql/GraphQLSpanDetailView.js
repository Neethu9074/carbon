import React, { Fragment } from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';

export default function GraphQLSpanDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="Operation Type">{span.getIn(['data', 'graphql', 'operationType'])}</DescriptionItem>
      <DescriptionItem title="Operation Name">{span.getIn(['data', 'graphql', 'operationName'])}</DescriptionItem>
      <ErrorDescriptionItem error={span.getIn(['data', 'graphql', 'errors'])} />
      {getObjectTypeDetails(span)}
    </DescriptionList>
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
        <DescriptionItem title={`Object Type "${objectType}"`} key={`${objectType}`}>
          {content}
        </DescriptionItem>
      );
    })
    .valueSeq()
    .toArray();
}
