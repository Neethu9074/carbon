import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import getForgeComponent from 'in-services/getForgeComponent';
import Separator from 'in-sdk/components/sidebar/Separator';
import getFoundation from 'in-hoc/getFoundation';
import { getSingular } from 'in-sdk/pluginName';

export default getFoundation(HostHardware);

function HostHardware({ foundationSnapshot }) {
  if (!foundationSnapshot) return null;
  const Details = getForgeSpecificComponent(foundationSnapshot);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>
          {getSingular(foundationSnapshot.get('plugin'))}
        </Collapsible.Header>
        <Collapsible.Content>
          <Details snapshot={foundationSnapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

function getForgeSpecificComponent(snapshot) {
  return getForgeComponent('./' + snapshot.get('plugin') + '/Sidebar/Details.es6');
}
