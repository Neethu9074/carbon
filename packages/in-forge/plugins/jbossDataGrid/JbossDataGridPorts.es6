import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import { emptyMap } from 'in-services/fixedImmutables';

export default function JbossDataGridPorts({ snapshot }) {
  const ports = snapshot.getIn(['data', 'ports'], emptyMap);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Ports</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            {ports
              .map((port, portName) => (
                <DescriptionItem title={portName} key={portName}>
                  {port}
                </DescriptionItem>
              ))
              .valueSeq()
              .toArray()}
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
