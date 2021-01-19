/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyMap } from 'in-services/fixedImmutables';

export default function Ports({ snapshot }) {
  const ports = snapshot.getIn(['data', 'ports'], emptyMap).toOrderedMap();
  if (ports.size === 0) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Ports</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {ports
              .map((portNumber, portName) => <DescriptionItem title={portName}>{portNumber}</DescriptionItem>)
              .valueSeq()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
