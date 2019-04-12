import React from 'react';

import { getLabel, getShowZoneInSidebarHeader } from 'in-sdk/snapshot';
import ZoneTag from 'in-components/MapSidebar/components/ZoneTag';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';

import locals from './SidebarHeader.mless';

export default function SidebarHeader({ snapshot }) {
  const plugin = snapshot.get('plugin');
  const entityType = getSingular(plugin);

  return (
    <div className={locals.sidebarHeader}>
      <div className={locals.entity}>
        <PluginIcon className={locals.entityIcon} dimension={25} color="#000" snapshot={snapshot} />
        <div>
          <h1 className={locals.entityLabel}>{getLabel(snapshot)}</h1>
          <div className={locals.typeIdWrapper}>
            <span className={locals.entityType}>{entityType}</span>

            {getShowZoneInSidebarHeader(plugin) ? <ZoneTag snapshotId={snapshot.get('id')} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
