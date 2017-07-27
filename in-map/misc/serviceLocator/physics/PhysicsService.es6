import { OCTREE } from 'in-map/misc/Octree';

import { OCTREE_LAYER } from 'in-map/misc/serviceLocator/physics/physicsConstants';
import { emptyArray } from 'in-services/fixedObjects';
import { eventBus } from 'in-map/services/eventBus';

export default function createPhysicsService() {
  const octrees = [];
  octrees[OCTREE_LAYER.NODES] = createOctree();
  octrees[OCTREE_LAYER.LAYER] = createOctree();

  let zoomLevelSubscription;

  function init() {
    setInterval(updateOctrees, 200);

    zoomLevelSubscription = eventBus.on('zoomLevelChanged').subscribe(zoomLevel => {
      if (zoomLevel > 250) {
        octrees[OCTREE_LAYER.LAYER].isEnabled = false;
      } else {
        octrees[OCTREE_LAYER.LAYER].isEnabled = true;
      }
    });
  }

  function createOctree() {
    const octree = new OCTREE.Octree({
      // uncomment below to see the octree (may kill the fps)
      // scene: this.scene,
      // when undeferred = true, objects are inserted immediately
      // instead of being deferred until next octree.update() call
      // this may decrease performance as it forces a matrix update
      undeferred: false,
      // set the max depth of tree
      depthMax: 16,
      // max number of objects before nodes split or merge
      objectsThreshold: 16,
      // percent between 0 and 1 that nodes will overlap each other
      // helps insert objects that lie over more than one node
      overlapPct: 0
    });
    octree.isEnabled = true;

    return octree;
  }

  function addCollisionObject(obj, layer = 0) {
    if (obj) {
      octrees[layer].add(obj, { useFaces: false });
    }
  }

  function removeCollisionObject(obj, layer = 0) {
    octrees[layer].remove(obj);
  }

  function dispose() {
    clearInterval(updateOctrees, 200);

    zoomLevelSubscription.dispose();
    zoomLevelSubscription = null;
  }

  function updateOctrees() {
    for (let i = octrees.length - 1; i >= 0; i--) {
      const octree = octrees[i];
      if (octree) {
        octree.update();
      }
    }
  }

  function checkRaycaster(raycaster) {
    raycaster.far = Math.min(2500, raycaster.far); // [0, 2500]
    const ray = raycaster.ray;

    // iterate all octrees backwards from the highest layer to the lowest
    for (let i = octrees.length - 1; i >= 0; i--) {
      const octree = octrees[i];

      // because there can be an octree on layer 7 and 5 but not on 6, check it's presence
      if (!octree || !octree.isEnabled) {
        continue;
      }

      const octree2Objects = octree
        .search(ray.origin, ray.far, ray.direction)
        .filter(object => object.object.isEnabled)
        .map(object => {
          return {
            object: object.object,
            faces: emptyArray,
            vertices: emptyArray
          };
        });

      const intersections = raycaster.intersectOctreeObjects(octree2Objects);
      if (intersections.length > 0) {
        return intersections.sort((i1, i2) => i1.distance - i2.distance)[0].object;
      }
    }

    return undefined;
  }

  return {
    init,
    checkRaycaster,
    addCollisionObject,
    removeCollisionObject,
    dispose
  };
}
