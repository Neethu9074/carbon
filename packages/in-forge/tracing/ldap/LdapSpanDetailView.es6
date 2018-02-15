import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function LdapSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="URL">{span.getIn(['data', 'ldap', 'url'])}</DescriptionItem>
        <DescriptionItem title="Query">{span.getIn(['data', 'ldap', 'query'])}</DescriptionItem>
        <DescriptionItem title="Error">{span.getIn(['data', 'ldap', 'error'])}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
