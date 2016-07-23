import React from 'react';

import {getLinkToSnapshotInCurrentView} from 'in-stores/navigation';
import {groupsColorPool} from 'in-services/util/ColorGenerator';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import getZone from 'in-hoc/getZone';

import './ZoneTag.less';

const block = 'in-zone-tag';

export default getZone(connectTo(props => {
  if (props.zoneSnapshot) {
    return {
      href: getLinkToSnapshotInCurrentView(props.zoneSnapshot.get('id'))
    };
  }
  return {};
}, function ZoneTag({zoneSnapshot, href}) {
  if (!zoneSnapshot) {
    return null;
  }

  const background = groupsColorPool.getColorHex(zoneSnapshot.get('id'));

  return (
    <a className={block}
       href={href}
       style={{background}}>
      {getLabel(zoneSnapshot)}
    </a>
  );
}));
