import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyMap } from 'in-services/fixedImmutables';

export default function Ports({ snapshot }) {
  const ports = snapshot.getIn(['data', 'ports'], emptyMap).toOrderedMap();
  if (ports.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          Ports
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {ports
              .map((portNumber, portName) => (
                <DescriptionItem title={portName}>
                  {portNumber}
                </DescriptionItem>
              ))
              .valueSeq()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
