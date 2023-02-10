/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { fromPromise } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import SidebarBreadcrumb from 'in-map/components/MapSidebar/components/SidebarBreadcrumb';
import MapSidebarHeader from 'in-map/components/MapSidebar/components/MapSidebarHeader';
import SidebarContent from 'in-map/components/MapSidebar/components/SidebarContent';
import { getForgeComponent } from 'in-sdk/getForgeComponent';
import { selectedSnapshot$ } from 'in-stores/snapshot';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

import locals from './MapSidebar.mless';

export default connectTo(
  {
    snapshot: selectedSnapshot$,
    timeConfig: timeConfig$
  },
  function MapSidebar({ snapshot, timeConfig }) {
    const SidebarImpl = useObservable(getSidebarImpl, [snapshot?.get('plugin')]);
    if (!snapshot || !SidebarImpl) {
      return null;
    }

    return (
      <div className={locals.mapSidebar}>
        <MapSidebarHeader snapshot={snapshot} timeConfig={timeConfig} />
        <SidebarBreadcrumb snapshotId={snapshot.get('id')} />

        <div className={locals.scrollWrapper}>
          <SidebarContent snapshot={snapshot} ForgeDetailsComponent={SidebarImpl} />
        </div>
      </div>
    );
  }
);

function getSidebarImpl([plugin]) {
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Sidebar/Details.js`));
}
