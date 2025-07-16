/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Group, Node } from 'in-map/misc/physical/layoutingStrategies/graphTypes';
import { ID_OF_UNMONITORED_ZONE } from 'in-forge/constants';
import { compareIgnoreCase } from 'in-services/util/string';

export function sortGroups(_groups: Group[]): Group[] {
  // doerte sort -> unmonitored zone is the last one
  _groups.sort((a, b) => {
    if (a.id === ID_OF_UNMONITORED_ZONE) {
      return Number.MAX_VALUE;
    }
    if (b.id === ID_OF_UNMONITORED_ZONE) {
      return -1 * Number.MAX_VALUE;
    }
    return compareIgnoreCase(a._cachedLabel, b._cachedLabel);
  });

  return _groups;
}

export function sortNodes(_nodes: Node[]): Node[] {
  _nodes.sort((a, b) => a._cachedLabel.localeCompare(b._cachedLabel));
  return _nodes;
}
