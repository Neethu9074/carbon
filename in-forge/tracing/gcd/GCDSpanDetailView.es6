import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function GCDSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Operation">
          {span.getIn(['data', 'gcd', 'op'])}
        </DescriptionItem>
        <DescriptionItem title="Operation mode">
          {span.getIn(['data', 'gcd', 'mode'])}
        </DescriptionItem>
        <DescriptionItem title="Namespace">
          {span.getIn(['data', 'gcd', 'namespace'])}
        </DescriptionItem>
        <DescriptionItem title="Entity Identifier">
          {span.getIn(['data', 'gcd', 'entity', 'identifier'])}
        </DescriptionItem>
        <DescriptionItem title="Entity properties">
          {span.getIn(['data', 'gcs', 'entity', 'properties'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
