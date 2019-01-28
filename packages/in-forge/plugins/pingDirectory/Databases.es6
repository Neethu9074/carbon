import React from 'react';

import Collapsible from 'in-components/Collapsible';
import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function Databases({ snapshot }) {
  const databases = snapshot.getIn(['data', 'recent_changes.names']);
  if (!databases) {
    return null;
  }
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Databases</Collapsible.Header>
        <Collapsible.Content>
          {databases.map((database, i) => (
            <DescriptionList key={i}>
              <DescriptionItem>{database}</DescriptionItem>
            </DescriptionList>
          ))}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
