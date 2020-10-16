import React from 'react';

import { getLabel, getShowZoneInSidebarHeader } from 'in-sdk/snapshot';
import ZoneTag from 'in-components/MapSidebar/components/ZoneTag';
import { shorten } from 'in-services/util/string';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';

import locals from './SidebarHeader.mless';

export default function SidebarHeader({ snapshot }) {
  const plugin = snapshot.get('plugin');
  const entityType = getSingular(plugin);

  return (
    <div className={locals.sidebarHeader}>
      <div className={locals.entity}>
        <PluginIcon className={locals.entityIcon} snapshot={snapshot} />
        <div>
          <h1 className={locals.entityLabel}>{shorten(getLabel(snapshot) || '', 128)}</h1>
          <div className={locals.typeIdWrapper}>
            <span className={locals.entityType}>{entityType}</span>

            {getShowZoneInSidebarHeader(plugin) ? <ZoneTag snapshotId={snapshot.get('id')} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
