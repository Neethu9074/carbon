import {combineLatest} from 'reactive-observables';

import {PHYSICAL_LAYOUTING} from 'in-map/misc/TimingConfig';
import {groups} from 'in-map/stores/physical/groupsStore';
import {nodes} from 'in-map/stores/physical/nodesStore';
import {eventBus} from 'in-map/services/eventBus';


export default function createLayouter() {
  const layoutingSubscription = combineLatest([nodes.stream,
                                               groups.stream,
                                               eventBus.on('layoutNeedsUpdate')])
                               .debounce(PHYSICAL_LAYOUTING)
                               .subscribe(([_nodes, _groups]) => applyLayout(_nodes, _groups));

  function applyLayout(_nodes, _groups) {
    _nodes = Object.keys(_nodes).map(key => _nodes[key]);
    _groups = Object.keys(_groups).map(key => _groups[key]);

    const size = _nodes.length;
    const dotsPerLine = size / 5;
    const gapBetweenBoxes = (size * 2 / dotsPerLine);
    let angle = 0;
    let lineAngle = 0;
    const positions = [];

    const center = { x: 0, y: 0 };
    for (let edge = 0; edge < 5; edge++) {
      const x1 = Math.sin(angle * Math.PI / 180) * size;
      const y1 = Math.cos(angle * Math.PI / 180) * size;
      const p1 = { x: x1 + center.x, y: y1 + center.y};
      lineAngle = angle;
      angle = (angle + 180 + 36) % 360;

      // to get the point for the boxes, we calculate points on a circle, which originates at p1.
      // in the loop, we increment the radius and calculate the sin/cos point
      // for the inverted original angle betwenn p1 and p2
      const invertedSin = Math.sin(((lineAngle + 180 + 18) % 360) * Math.PI / 180);
      const invertedCos = Math.cos(((lineAngle + 180 + 18) % 360) * Math.PI / 180);
      for (let box = 0; box < dotsPerLine; box++) {
        const boxX = invertedSin * (gapBetweenBoxes * box);
        const boxY = invertedCos * (gapBetweenBoxes * box);
        positions.push({
          x: boxX + p1.x,
          y: boxY + p1.y
        });
      }
    }

    _groups.forEach(group => {
      const transform = group.getComponent('transform');
      transform.setPositionXYZ(-1000, 0, 0);
      transform.setScaleXYZ(0, 0, 0);
    });

    _nodes.forEach((node, index) => {
      const transform = node.getComponent('transform');
      const position = positions[index];

      transform.setPositionXYZ(position.x / 1.5, 0, position.y / 1.5);
    });
  }

  return {
    dispose
  };

  function dispose() {
    layoutingSubscription.dispose();
  }
}
