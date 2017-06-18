import createCollection from 'in-map/stores/ObjectCollectionStream';
import { groups } from 'in-map/stores/physical/groupsStore';
import services from 'in-map/stores/logical/servicesStore';
import { nodes } from 'in-map/stores/physical/nodesStore';
import { getBigBangTime, getFPS } from 'in-map/misc/time';
import connections from 'in-map/stores/connectionsStore';
import { eventBus } from 'in-map/services/eventBus';
import { scene$ } from 'in-map/stores/sceneStore';

const statistics = createCollection();
export default statistics;

if (__DEV__) {
  let statisticsCollected = true;
  let scene = null;
  let minFPS = Number.MAX_VALUE;
  let maxFPS = 0;
  let framesRendered = 0;
  let numGroups = -1;
  let numNodes = -1;
  let numServices = -1;
  let numConnections = -1;
  let numLayer = -1;

  let updateSubscription;
  let renderSubscription;

  groups.stream.subscribe(_groups => (numGroups = _groups.size));
  services.stream.subscribe(_services => (numServices = _services.size));
  nodes.stream.subscribe(_nodes => {
    numNodes = _nodes.size;
    numLayer = 0;

    _nodes.forEach(node => {
      numLayer += node.layer.objects.size;
    });
  });
  connections.stream.subscribe(_connections => (numConnections = _connections.size));

  scene$.subscribe(s => {
    scene = s;

    if (scene) {
      if (updateSubscription) updateSubscription.dispose();
      if (renderSubscription) renderSubscription.dispose();

      updateSubscription = eventBus.on('update').subscribe(() => {
        const fps = getFPS();
        minFPS = Math.min(fps, minFPS);
        maxFPS = Math.max(fps, maxFPS);
      });

      renderSubscription = eventBus.on('willRenderObject').subscribe(() => {
        framesRendered++;
      });
    }
  });

  const callback = function collectMapStatistics() {
    if (!statisticsCollected || !scene) {
      return;
    }
    statisticsCollected = false;

    const renderer = scene.renderer;
    if (!renderer) {
      return;
    }

    const renderInfo = renderer.info.render;
    const memoryInfo = renderer.info.memory;

    statistics.add(
      'time',
      new Map([['seconds', getBigBangTime() | 0], ['FPS_possible', getFPS() + ' (' + minFPS + '/' + maxFPS + ')']])
    );

    statistics.add(
      'renderer',
      new Map([
        ['geometries', memoryInfo.geometries],
        ['textures', memoryInfo.textures],
        ['drawCalls', renderInfo.calls],
        ['faces', renderInfo.faces],
        ['points', renderInfo.points],
        ['vertices', renderInfo.vertices],
        ['framesRendered', framesRendered]
      ])
    );

    statistics.add(
      'scene objects',
      new Map([
        ['numConnections', numConnections],
        ['physical', new Map([['numGroups', numGroups], ['numNodes', numNodes], ['numLayer', numLayer]])],
        ['logical', new Map([['numServices', numServices]])]
      ])
    );

    statisticsCollected = true;
  };

  setInterval(callback, 1000);
}
