import { fromPromise } from '@instana/observables';
import React from 'react';

import SidebarBreadcrumb from 'in-map/components/MapSidebar/components/SidebarBreadcrumb';
import MapSidebarHeader from 'in-map/components/MapSidebar/components/MapSidebarHeader';
import SidebarContent from 'in-map/components/MapSidebar/components/SidebarContent';
import { getForgeComponent } from 'in-services/getForgeComponent';
import { debouncedResize$ } from 'in-services/browser';
import { selectedSnapshot$ } from 'in-stores/snapshot';
import { timeConfig$ } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';
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
    const SidebarImpl = useObservable(getSidebarImpl, [snapshot?.get('plugin')]);
    if (!snapshot || !SidebarImpl) {
      return null;
    }

    return (
      <div
        className={locals.mapSidebar}
        style={{
          maxHeight: toPx(windowHeight - 150)
        }}
      >
        <MapSidebarHeader snapshot={snapshot} timeConfig={timeConfig} />
        <SidebarBreadcrumb snapshotId={snapshot.get('id')} />

        <div
          className={locals.scrollWrapper}
          style={{
            maxHeight: toPx(windowHeight - 350)
          }}
        >
          <SidebarContent snapshot={snapshot} ForgeDetailsComponent={SidebarImpl} />
        </div>
      </div>
    );
  }
);

function getSidebarImpl([plugin]) {
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Sidebar/Details.js`));
}
