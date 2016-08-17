import createCollection from 'in-map/stores/ObjectColletionStream';
import services from 'in-map/stores/logical/servicesStore';
import connections from 'in-map/stores/connectionsStore';
import groups from 'in-map/stores/physical/groupsStore';
import nodes from 'in-map/stores/physical/nodesStore';
import {eventBus} from 'in-map/services/eventBus';
import {scene$} from 'in-map/stores/sceneStore';
import * as time from 'in-map/misc/time';


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

  groups.stream.subscribe(_groups => numGroups = Object.keys(_groups.objects).length);
  services.stream.subscribe(_services => numServices = Object.keys(_services.objects).length);
  nodes.stream.subscribe(_nodes => {
    const keys = Object.keys(_nodes.objects);
    numNodes = keys.length;

    numLayer = 0;
    keys.forEach(key => numLayer += Object.keys(_nodes.objects[key].layer.objects).length);
  });
  connections.stream.subscribe(_connections => numConnections = Object.keys(_connections.objects).length);

  scene$.subscribe(s => {
    scene = s;

    if (scene) {
      if (updateSubscription) updateSubscription.dispose();
      if (renderSubscription) renderSubscription.dispose();

      updateSubscription = eventBus.on('update').subscribe(() => {
        const fps = time.getFPS();
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
    const renderInfo = renderer.info.render;
    const memoryInfo = renderer.info.memory;

    statistics.add('time', {
      seconds: time.getBigBangTime() | 0,
      FPS_possible: time.getFPS() + ' (' + minFPS + '/' + maxFPS + ')'
    });

    statistics.add('renderer', {
      framesRendered,
      geometries: memoryInfo.geometries,
      textures: memoryInfo.textures,
      drawCalls: renderInfo.calls,
      faces: renderInfo.faces,
      points: renderInfo.points,
      vertices: renderInfo.vertices,
      programs: renderer.info.programs
    });

    statistics.add('scene objects', {
      numConnections,
      physical: {
        numGroups,
        numNodes,
        numLayer
      },
      logical: {
        numServices
      }
    });

    statisticsCollected = true;
  };

  setInterval(callback, 1000);
}
