import React from 'react';

import SidebarHealthInfo from 'in-components/MapSidebar/components/SidebarHealthInfo';
import { getLabel, getShowZoneInSidebarHeader } from 'in-sdk/snapshot';
import ZoneTag from 'in-components/MapSidebar/components/ZoneTag';
import Separator from 'in-sdk/components/sidebar/Separator';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';

import './SidebarHeader.less';

const block = 'in-sidebar-header';

export default function SidebarHeader({ snapshot }) {
  const plugin = snapshot.get('plugin');
  const entityType = getSingular(plugin);

  return (
    <div className={block}>
      <div className={`${block}__entity`}>
        <PluginIcon className={`${block}__entity-icon`} dimension={25} color="#000" snapshot={snapshot} />
        <div className={`${block}__entity-description`}>
          <h1 className={`${block}__entity-label`}>
            {getLabel(snapshot)}
          </h1>
          <div className={`${block}__type-id-wrapper`}>
            <span className={`${block}__entity-type`}>
              {entityType}
            </span>

            {getShowZoneInSidebarHeader(plugin) ? <ZoneTag snapshotId={snapshot.get('id')} /> : null}
          </div>
        </div>
      </div>

      <Separator />

      <SidebarHealthInfo snapshotId={snapshot.get('id')} />
    </div>
  );
}
