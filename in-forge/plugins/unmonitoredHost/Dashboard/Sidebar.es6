import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';


export default function UnmonitoredHostSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Network Information
        </Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title='IPv4'>
              {snapshot.getIn(['data', 'ipv4'])}
            </DescriptionItem>
            <DescriptionItem title='Reverse Lookup'>
              {snapshot.getIn(['data', 'dnsName'])}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

UnmonitoredHostSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
