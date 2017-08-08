import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function FaunaDBSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Query">
          {span.getIn(['data', 'faunadb', 'query'])}
        </DescriptionItem>
        <DescriptionItem title="Error">
          {span.getIn(['data', 'faunadb', 'error'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
