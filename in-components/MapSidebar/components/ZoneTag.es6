import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation';
import { groupsColorPool } from 'in-services/util/ColorGenerator';
import { getLabel } from 'in-sdk/snapshot';
import Link from 'in-components/Link';
import getZone from 'in-hoc/getZone';

import './ZoneTag.less';

const block = 'in-zone-tag';

export default getZone(function ZoneTag({ zoneSnapshot }) {
  if (!zoneSnapshot) {
    return null;
  }

  const background = groupsColorPool.getColorHex(zoneSnapshot.get('id'));

  return (
    <Link className={block} href={getLinkToSnapshotInCurrentView(zoneSnapshot.get('id'))} style={{ background }}>
      {getLabel(zoneSnapshot)}
    </Link>
  );
});
