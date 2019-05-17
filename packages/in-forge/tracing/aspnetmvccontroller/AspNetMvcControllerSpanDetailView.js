import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function WebApiSpanDetailView({ span }) {
  const controller = span.getIn(['data', 'aspnetmvccontroller', 'controller']);
  const error = span.getIn(['data', 'aspnetmvccontroller', 'error']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Controller">{controller ? controller : 'unknown'}</DescriptionItem>
        <DescriptionItem title="Action">{span.getIn(['data', 'aspnetmvccontroller', 'action'])}</DescriptionItem>
        <DescriptionItem title="Url">{span.getIn(['data', 'aspnetmvccontroller', 'url'])}</DescriptionItem>
        <ErrorDescriptionItem error={error} />
      </DescriptionList>
    </div>
  );
}
