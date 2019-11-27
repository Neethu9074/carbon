import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function SymfonySpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title="Template">{span.getIn(['data', 'twig', 'template'])}</Di>
        <Di title="Subtemplate Count">{span.getIn(['data', 'twig', 'subtemplate_count'])}</Di>
      </Dl>
    </div>
  );
}