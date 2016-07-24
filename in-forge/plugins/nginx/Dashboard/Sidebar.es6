import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import NginxInfo from '../NginxInfo';


export default function NginxSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Nginx</Collapsible.Header>
        <Collapsible.Content>
          <NginxInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

NginxSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
