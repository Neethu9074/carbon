import React from 'react';

import SidebarBreadcrumb from 'in-components/MapSidebar/components/SidebarBreadcrumb';
import MapSidebarHeader from 'in-components/MapSidebar/components/MapSidebarHeader';
import SidebarContent from 'in-components/MapSidebar/components/SidebarContent';
import getForgeComponent from 'in-services/getForgeComponent';
import { debouncedResize$ } from 'in-services/browser';
import { selectedSnapshot$ } from 'in-stores/snapshot';
import { timeConfig$ } from 'in-stores/time/config';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import locals from './MapSidebar.mless';

export default connectTo(
  {
    snapshot: selectedSnapshot$,
    windowHeight: debouncedResize$.map(() => window.innerHeight).startWithFn(() => window.innerHeight),
    timeConfig: timeConfig$
  },
  function MapSidebar({ snapshot, windowHeight, timeConfig }) {
    if (!snapshot) {
      return null;
    }

    const plugin = snapshot.get('plugin');
    const SidebarImpl = getForgeComponent(`./${plugin}/Sidebar/Details.js`);

    return (
      <div
        className={locals.mapSidebar}
        style={{
          maxHeight: toPx(windowHeight - 120)
        }}
      >
        <MapSidebarHeader snapshot={snapshot} timeConfig={timeConfig} />
        <SidebarBreadcrumb snapshotId={snapshot.get('id')} />

        <div
          className={locals.scrollWrapper}
          style={{
            maxHeight: toPx(windowHeight - 300)
          }}
        >
          <SidebarContent snapshot={snapshot} ForgeDetailsComponent={SidebarImpl} />
        </div>
      </div>
    );
  }
);
