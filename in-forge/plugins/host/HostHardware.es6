import irpt from 'react-immutable-proptypes';
import React from 'react';

import getForgeComponent from 'in-services/getForgeComponent';
import Collapsible from 'in-components/Collapsible';
import getFoundation from 'in-hoc/getFoundation';
import {getSingular} from 'in-sdk/pluginName';


export default getFoundation(HostHardware);

function HostHardware({foundationSnapshot}) {
  if (!foundationSnapshot) return null;
  const Details = getForgeSpecificComponent(foundationSnapshot);

  return (
    <Collapsible initiallyOpen={true}>
      <Collapsible.Header>
        {getSingular(foundationSnapshot.get('plugin'))}
      </Collapsible.Header>
      <Collapsible.Content>
        <Details snapshot={foundationSnapshot} />
      </Collapsible.Content>
    </Collapsible>
  );
}

HostHardware.propTypes = {
  foundationSnapshot: irpt.map
};


function getForgeSpecificComponent(snapshot) {
  return getForgeComponent(
    './' +
    snapshot.get('plugin') +
    '/Sidebar/Details.es6'
  );
}
