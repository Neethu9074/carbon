/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { fromPromise } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import SidebarBreadcrumb from 'in-map/components/MapSidebar/components/SidebarBreadcrumb';
import MapSidebarHeader from 'in-map/components/MapSidebar/components/MapSidebarHeader';
import { isUsageInfoPopupEnabled, playwithEnabled } from 'in-services/featureFlags';
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
      <div className={locals.carbonMapSidebar} role="region">
        <MapSidebarHeader snapshot={snapshot} timeConfig={timeConfig} />
        <SidebarBreadcrumb snapshotId={snapshot.get('id')} />
        <div
          className={classNames({
            [locals.scrollWrapper]: true,
            [locals.scrollWrapperBanner]: isUsageInfoPopupEnabled | playwithEnabled,
            [locals.scrollWrapperNoBanner]: !isUsageInfoPopupEnabled
          })}
        >
          <SidebarContent snapshot={snapshot} ForgeDetailsComponent={SidebarImpl} />
        </div>
      </div>
    );
  }
);

function getSidebarImpl([plugin]) {
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Sidebar/Details`));
}
