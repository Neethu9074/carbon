import { create } from '@instana/observables';

import { OCTREE_LAYER } from 'in-map/misc/serviceLocator/physics/physicsConstants';
import { OCTREE_UPDATES } from 'in-map/misc/TimingConfig';
import { emptyArray } from 'in-services/fixedObjects';
import { eventBus } from 'in-map/services/eventBus';
import { OCTREE } from 'in-map/misc/Octree';

export default function createPhysicsService() {
  const octrees = [];
  octrees[OCTREE_LAYER.NODES] = createOctree();
  octrees[OCTREE_LAYER.LAYER] = createOctree();

  const addObjectQueues = createQueues();
  const updateObjectQueues = createQueues();
  const removeObjectQueues = createQueues();

  let zoomLevelSubscription;

  const signal = {};
  signal[OCTREE_LAYER.NODES] = false;
  signal[OCTREE_LAYER.LAYER] = false;

  const updateSignal = create();
  let updateSignalSubscription;

  function init() {
    updateSignalSubscription = updateSignal.debounce(OCTREE_UPDATES).subscribe(_signal => {
      handleOctreeUpdate(_signal, OCTREE_LAYER.NODES);
      handleOctreeUpdate(_signal, OCTREE_LAYER.LAYER);
    });

    zoomLevelSubscription = eventBus.on('zoomLevelChanged').subscribe(zoomLevel => {
      if (zoomLevel > 250) {
        octrees[OCTREE_LAYER.LAYER].isEnabled = false;
      } else {
        octrees[OCTREE_LAYER.LAYER].isEnabled = true;
      }
    });
  }

  function handleOctreeUpdate(_signal, layer) {
    if (_signal[layer]) {
      _signal[layer] = false;

      for (let objectToRemove of removeObjectQueues[layer].values()) {
        octrees[layer].remove(objectToRemove);
      }

      for (let objectToAdd of addObjectQueues[layer].values()) {
        octrees[layer].add(objectToAdd);
      }

      for (let objectToUpdate of updateObjectQueues[layer].values()) {
        octrees[layer].remove(objectToUpdate);
        octrees[layer].add(objectToUpdate);
      }

      octrees[layer].update();

      addObjectQueues[layer].clear();
      updateObjectQueues[layer].clear();
      removeObjectQueues[layer].clear();
    }
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

  function addCollisionObject(obj, layer = OCTREE_LAYER.NODES) {
    if (obj) {
      addObjectQueues[layer].set(obj.uuid, obj);
      removeObjectQueues[layer].delete(obj.uuid);
      updateObjectQueues[layer].delete(obj.uuid);

      signal[layer] = true;
      updateSignal.emit(signal);
    }
  }

  function updateCollisionObject(obj, layer = OCTREE_LAYER.NODES) {
    if (obj) {
      if (!addObjectQueues[layer].has(obj.uuid)) {
        updateObjectQueues[layer].set(obj.uuid, obj);
      }
      removeObjectQueues[layer].delete(obj.uuid);

      signal[layer] = true;
      updateSignal.emit(signal);
    }
  }

  function removeCollisionObject(obj, layer = OCTREE_LAYER.NODES) {
    removeObjectQueues[layer].set(obj.uuid, obj);
    addObjectQueues[layer].delete(obj.uuid);
    updateObjectQueues[layer].delete(obj.uuid);

    signal[layer] = true;
    updateSignal.emit(signal);
  }

  function dispose() {
    updateSignalSubscription.dispose();
    updateSignalSubscription = null;

    zoomLevelSubscription.dispose();
    zoomLevelSubscription = null;
  }

  function checkRaycaster(raycaster) {
    raycaster.far = Math.min(10000, raycaster.far); // [0, 2500]
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

  function createQueues() {
    const queue = {};
    queue[OCTREE_LAYER.NODES] = new Map();
    queue[OCTREE_LAYER.LAYER] = new Map();
    return queue;
  }

  return {
    init,
    checkRaycaster,
    addCollisionObject,
    updateCollisionObject,
    removeCollisionObject,
    dispose
  };
}
