import React from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import { DescriptionItem } from 'in-components/DescriptionList';

import Code from 'in-sdk/components/traceDetails/Code';

export default function CustomDataDescriptionItem({ span }) {
  const custom = span.getIn(['data', 'sdk', 'custom']);

  if (!custom) {
    return null;
  }

  return (
    <DescriptionItem title="Data" verticalDisplay>
      <Code code={JSON.stringify(expandNestedSerializedJson(custom.toJS()), 0, 2)} lang="json" />
    </DescriptionItem>
  );
}
