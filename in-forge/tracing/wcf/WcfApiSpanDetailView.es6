import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function WebApiSpanDetailView({ span }) {
  const binding = span.getIn(['data', 'wcf', 'binding']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Service-Class">
          {span.getIn(['data', 'wcf', 'svcclass'])}
        </DescriptionItem>
        <DescriptionItem title="Action">
          {span.getIn(['data', 'wcf', 'svcmethod'])}
        </DescriptionItem>
        <DescriptionItem title="Binding">
          {binding ? binding : 'unknown'}
        </DescriptionItem>
        <DescriptionItem title="Url">
          {span.getIn(['data', 'wcf', 'localaddress'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
