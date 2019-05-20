import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function LdapSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="URL">{span.getIn(['data', 'ldap', 'url'])}</DescriptionItem>
        <DescriptionItem title="Query">{span.getIn(['data', 'ldap', 'query'])}</DescriptionItem>
        <ErrorDescriptionItem error={span.getIn(['data', 'ldap', 'error'])} />
      </DescriptionList>
    </div>
  );
}
