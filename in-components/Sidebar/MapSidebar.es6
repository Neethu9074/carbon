import {on} from 'reactive-observables';
import React from 'react';

import SidebarBreadcrumb from 'in-components/Sidebar/components/SidebarBreadcrumb';
import MapSidebarHeader from 'in-components/Sidebar/components/MapSidebarHeader';
import SidebarContent from 'in-components/Sidebar/components/SidebarContent';
import getForgeComponent from 'in-services/getForgeComponent';
import {selectedSnapshot$} from 'in-stores/snapshot';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './MapSidebar.less';

const block = 'in-map-sidebar';

export default connectTo({
  snapshot: selectedSnapshot$,
  windowHeight: on(window, 'resize')
    .map(() => window.innerHeight)
    .startWithFn(() => window.innerHeight)
}, function MapSidebar({snapshot, windowHeight}) {
  if (!snapshot) {
    return null;
  }

  const plugin = snapshot.get('plugin');
  const SidebarImpl = getForgeComponent(`./${plugin}/Sidebar/Details.es6`);

  return (
    <div className={block}>
      <MapSidebarHeader snapshot={snapshot} />
      <SidebarBreadcrumb snapshotId={snapshot.get('id')}/>

      <div className={`${block}__scroll-wrapper`}
           style={{
             maxHeight: toPx(windowHeight - 360)
           }}>
        <SidebarContent snapshot={snapshot}
                        ForgeDetailsComponent={SidebarImpl}/>
      </div>
    </div>
  );
});
