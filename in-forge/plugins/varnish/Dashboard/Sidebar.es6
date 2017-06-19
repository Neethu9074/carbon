import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import { emptyList } from 'in-services/fixedImmutables';

import Info from '../Info';
import Backends from '../Backends';

export default function VarnishSidebar({ snapshot }) {
  const backendNames = snapshot.getIn(['data', 'backend_names'], emptyList).toArray().sort();
  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>
          Varnish
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {backendNames.map(bEnd =>
        <div key={bEnd}>
          <Separator />

          <Collapsible initiallyOpen={false}>
            <Collapsible.Header>
              Backend: {bEnd}
            </Collapsible.Header>
            <Collapsible.Content>
              <Backends snapshot={snapshot} backend={bEnd} />
            </Collapsible.Content>
          </Collapsible>
        </div>
      )}

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
