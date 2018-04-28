import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';

export default function ConditionsList({ snapshot }) {
  const conditions = snapshot.getIn(['data', 'conditions'], emptyList);

  if (conditions.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Conditions ({conditions.size})</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {conditions.toArray().map(cond => (
              <DescriptionItem key={cond.get('type')} title={cond.get('type') + '=' + cond.get('status')}>
                @ {cond.get('lastTransitionTime')}
                <br /> {cond.get('message')}
              </DescriptionItem>
            ))}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
