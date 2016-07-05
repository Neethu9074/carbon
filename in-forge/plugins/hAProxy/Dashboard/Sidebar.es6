import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';
import RunningComponentsList from 'in-components/RunningComponentsList';

import HAProxyInfo from '../HAProxyInfo';


export default function HAProxySidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>HAProxy</Collapsible.Header>
        <Collapsible.Content>
          <HAProxyInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

HAProxySidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
