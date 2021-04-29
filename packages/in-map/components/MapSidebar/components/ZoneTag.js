/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import { groupsColorPool } from 'in-services/util/ColorGenerator';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';

import './ZoneTag.less';

const block = 'in-zone-tag';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshotId).flatMap(getSnapshot)
    };
  },
  function ZoneTag({ zoneSnapshot }) {
    if (!zoneSnapshot) {
      return null;
    }

    const background = groupsColorPool.getColorHex(zoneSnapshot.get('id'));

    return (
      <Link className={block} href$={getLinkToSnapshotInCurrentView(zoneSnapshot.get('id'))} style={{ background }}>
        {getLabel(zoneSnapshot)}
      </Link>
    );
  }
);
