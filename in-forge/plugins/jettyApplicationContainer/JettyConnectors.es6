import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import { emptyList } from 'in-services/fixedImmutables';

export default function JettyConnectors({ snapshot }) {
  const connectors = snapshot.getIn(['data', 'connectors'], emptyList).sortBy(connector => connector.get('port'));
  if (connectors.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Connectors</Collapsible.Header>
        <Collapsible.Content>
          {connectors.map((connector, i) => (
            <Collapsible initiallyOpen={false} key={i}>
              <Collapsible.Header>{connector.get('port') || '<unknown port>'}</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  <DescriptionItem title="Port">
                    {connector.get('port')}
                  </DescriptionItem>
                  <DescriptionItem title="Protocols">
                    {connector.get('protocols', emptyList).join(', ')}
                  </DescriptionItem>
                  <DescriptionItem title="State">
                    {connector.get('state')}
                  </DescriptionItem>
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          ))}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
