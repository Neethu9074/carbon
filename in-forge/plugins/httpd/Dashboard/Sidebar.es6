import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import HttpdInfo from '../HttpdInfo';


export default function HttpdSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Apache Httpd</Collapsible.Header>
        <Collapsible.Content>
          <HttpdInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

HttpdSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
