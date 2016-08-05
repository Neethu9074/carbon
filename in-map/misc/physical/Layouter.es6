import {combineLatest} from 'reactive-observables';

import groups from 'in-map/stores/physical/groupsStore';
import nodes from 'in-map/stores/physical/nodesStore';
import {eventBus} from 'in-map/services/eventBus';


const MAX_VALUE = Number.MAX_VALUE;
const idOfUnmonitoredZone = 'unmonitored-hosts-zone';

export default function createLayouter(map) {
  let firstLayoutDone = false;
  const squashFactor = 0.5;
  const groupMargin = 1;
  const nodeMargin = 2;

  const currentDimensions = {
    x: 0,
    y: 0
  };

  const layoutingSubscription = combineLatest([groups.stream, nodes.stream, eventBus.on('layoutNeedsUpdate')])
                               .debounce(100)
                               .subscribe(([_groups]) => applyLayout(_groups.objects));

  function applyLayout(_groups) {
    // transform map to array
    _groups = Object.keys(_groups).map(key => _groups[key]);

    currentDimensions.x = 0;
    currentDimensions.y = 0;

    // the first group starts at (0, 0)
    let groupXCursor = 0;
    sortGroups(_groups).forEach(group => {
      const _nodes = Object.keys(group.nodes.objects).map(key => group.nodes.objects[key]);
      const numNodesPerRow = Math.ceil(squashFactor * Math.sqrt(_nodes.length));
      const numNodesPerCol = Math.ceil(_nodes.length / numNodesPerRow);
      const dim = {
        x: groupXCursor,
        width: nodeMargin + numNodesPerRow + (numNodesPerRow - 1) * nodeMargin,
        height: nodeMargin + numNodesPerCol + (numNodesPerCol - 1) * nodeMargin
      };

      const transform = group.getComponent('transform');
      transform.setPositionXYZ(dim.x + dim.width / 2 - 1,
                               0,
                               -dim.height / 2 + 1);
      transform.setScaleXYZ(dim.width,
                            1,
                            dim.height);

      let nodeXCursor = groupXCursor + 1;
      let nodeYCursor = 1;

      sortNodes(_nodes).forEach(node => {
        currentDimensions.x = Math.max(currentDimensions.x, nodeXCursor);
        currentDimensions.y = Math.max(currentDimensions.y, nodeYCursor);

        node.getComponent('transform').setPositionXYZ(nodeXCursor - 0.5, 0, -nodeYCursor + 0.5);

        nodeXCursor += nodeMargin + 1;
        if (nodeXCursor >= dim.x + dim.width) {
          nodeXCursor = groupXCursor + 1;
          nodeYCursor += nodeMargin + 1;
        }
      });

      groupXCursor += dim.width + groupMargin;
    });

    if (!firstLayoutDone) {
      firstLayoutDone = true;
      map.eventEmitter.emit('flyToPosition', getFocusPointFromCurrentDimensions());
    }
  }

  function getFocusPointFromCurrentDimensions() {
    return {
      x: currentDimensions.x / 2,
      z: -currentDimensions.y / 4
    };
  }

  function sortGroups(_groups) {
    // doerte sort -> unmonitored zone is the last one
    _groups.sort((a, b) => {
      if (a.id === idOfUnmonitoredZone) {
        return MAX_VALUE;
      }
      if (b.id === idOfUnmonitoredZone) {
        return -1 * MAX_VALUE;
      }
      return a._cachedLabel.localeCompare(b._cachedLabel);
    });

    return _groups;
  }

  function sortNodes(_nodes) {
    _nodes.sort((a, b) => a._cachedLabel.localeCompare(b._cachedLabel));

    return _nodes;
  }

  function dispose() {
    layoutingSubscription.dispose();
  }

  return {
    getFocusPointFromCurrentDimensions,
    dispose
  };
}
