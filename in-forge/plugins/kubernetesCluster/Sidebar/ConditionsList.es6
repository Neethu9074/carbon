import React from 'react';

import { emptyList } from 'in-services/fixedImmutables';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

export default function ConditionsList({ snapshot }) {
  const conditions = snapshot.getIn(['data', 'conditions'], emptyList);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Conditions</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {conditions.map(cond => (
              <DescriptionItem key={cond.get('type')} title={cond.get('type') + '=' + cond.get('status')}>
                @ {cond.get('lastTransitionTime')}
              </DescriptionItem>
            ))}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
