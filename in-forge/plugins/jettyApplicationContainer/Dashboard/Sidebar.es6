import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';

import JettyThreadsInfo from '../JettyThreadsInfo.es6';
import JettyConnectors from '../JettyConnectors.es6';
import JettyWebApps from '../JettyWebApps.es6';
import Info from '../Info.es6';


export default function JettySidebar({snapshot}) {
  return (
    <div>
      <Info snapshot={snapshot} />
      <JettyThreadsInfo snapshot={snapshot} />
      <JettyConnectors snapshot={snapshot} />
      <JettyWebApps snapshot={snapshot} />
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}
