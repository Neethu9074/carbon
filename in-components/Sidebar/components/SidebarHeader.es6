import React from 'react';

import SidebarHealthInfo from 'in-components/Sidebar/components/SidebarHealthInfo';
import {getLabel, getIcon, getShowZoneInSidebarHeader} from 'in-sdk/snapshot';
import ZoneTag from 'in-components/Sidebar/components/ZoneTag';
import Separator from 'in-sdk/components/sidebar/Separator';
import {getSingular} from 'in-sdk/pluginName';

import './SidebarHeader.less';

const block = 'in-sidebar-header';

export default function SidebarHeader({snapshot}) {
  const entityType = getSingular(snapshot.get('plugin'));

  return (
    <div className={block}>
      <div className={`${block}__entity`}>
        <img src={getIcon(snapshot)}
             alt={`Icon for entities of type ${entityType}`}
             className={`${block}__entity-icon`}/>
        <div className={`${block}__entity-description`}>
          <h1 className={`${block}__entity-label`}>
            {getLabel(snapshot)}
          </h1>
          <div className={`${block}__type-id-wrapper`}>
            <span className={`${block}__entity-type`}>
              {entityType}
            </span>

            {getShowZoneInSidebarHeader(snapshot.get('plugin')) ?
              <ZoneTag snapshotId={snapshot.get('id')} />
            : null}
          </div>
        </div>
      </div>

      <Separator />

      <SidebarHealthInfo snapshotId={snapshot.get('id')}/>

      <Separator />
    </div>
  );
}
