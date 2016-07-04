import irpt from 'react-immutable-proptypes';
import React from 'react';

import RunningComponentsList from 'in-components/RunningComponentsList';

import JettyThreadsInfo from '../JettyThreadsInfo.es6';
import JettyConnectors from '../JettyConnectors.es6';
import JettyWebApps from '../JettyWebApps.es6';
import JettyInfo from '../JettyInfo.es6';


export default function JettySidebar({snapshot}) {
  return (
    <div>
      <JettyInfo snapshot={snapshot} />
      <JettyThreadsInfo snapshot={snapshot} />
      <JettyConnectors snapshot={snapshot} />
      <JettyWebApps snapshot={snapshot} />
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

JettySidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
