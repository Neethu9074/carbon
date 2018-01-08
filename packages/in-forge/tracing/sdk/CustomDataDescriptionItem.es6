import React from 'react';

import { DescriptionItem } from 'in-components/DescriptionList';

import Code from 'in-sdk/components/traceDetails/Code';

export default function CustomDataDescriptionItem({ span }) {
  const custom = span.getIn(['data', 'sdk', 'custom']);

  if (!custom) {
    return null;
  }

  return (
    <DescriptionItem title="Custom Data">
      <Code code={JSON.stringify(custom.toJS(), 0, 2)} lang="json" />
    </DescriptionItem>
  );
}
