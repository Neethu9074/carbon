import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';

import {emptyList} from 'in-services/fixedImmutables';


export default function JettyConnectors({snapshot}) {
  const connectors = snapshot.getIn(['data', 'connectors'], emptyList);

  return (
    <div>
      {connectors.map(connector =>
        <Collapsible initiallyOpen={false} key={connector.get('port')}>
          <Collapsible.Header>Connector @{connector.get('port')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title='Port'>
                {connector.get('port')}
              </DescriptionItem>
              <DescriptionItem title='Protocols'>
                {connector.get('protocols').join(', ')}
              </DescriptionItem>
              <DescriptionItem title='State'>
                {connector.get('state')}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}
    </div>
  );
}

JettyConnectors.propTypes = {
  snapshot: irpt.map.isRequired
};
