/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-disable no-console */
import createCollection from 'in-map/stores/ObjectCollectionStream';
import { groups } from 'in-map/stores/physical/groupsStore';
import { nodes } from 'in-map/stores/physical/nodesStore';
import { getBigBangTime, getFPS } from 'in-map/misc/time';
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
  let numLayer = -1;

  let updateSubscription;
  let renderSubscription;

  groups.stream.debounce(1000).subscribe(_groups => (numGroups = _groups.size));
  nodes.stream.debounce(1000).subscribe(_nodes => {
    numNodes = _nodes.size;
    numLayer = 0;

    _nodes.forEach(node => {
      numLayer += node.layer.objects.size;
    });
  });

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
      new Map([
        ['seconds', getBigBangTime() | 0],
        ['FPS_possible', getFPS() + ' (' + minFPS + '/' + maxFPS + ')']
      ])
    );

    if (memoryInfo) {
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
    }

    statistics.add(
      'scene objects',
      new Map([
        [
          'physical',
          new Map([
            ['numGroups', numGroups],
            ['numNodes', numNodes],
            ['numLayer', numLayer]
          ])
        ]
      ])
    );

    statisticsCollected = true;
  };

  setInterval(callback, 1000);

  window.instana.dev.getMapStatistics = () => {
    statistics.stream.once(_statistics => console.log(_statistics));
  };
}
