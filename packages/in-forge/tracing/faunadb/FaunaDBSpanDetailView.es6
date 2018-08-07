import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function FaunaDBSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Query">{span.getIn(['data', 'faunadb', 'query'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'faunadb', 'error'])} />
      </DescriptionList>
    </div>
  );
}
