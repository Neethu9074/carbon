/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyList } from 'in-services/fixedImmutables';

export default function ConditionsList({ snapshot }) {
  const conditions = snapshot.getIn(['data', 'conditions'], emptyList);

  if (conditions.size === 0) {
    return null;
  }

  return (
    <div>
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
