'use strict';

import * as time from './timeCalculations';
import {getAllNodes, getAllGroups} from './mapStructureUtils';


let minFPS = 1000;
let maxFPS = 0;
let fpsCounter = 0;
let tickCounter = 0;

export function getMapStatistics(scene) {
  const renderer = scene.renderer;
  const renderInfo = renderer.info.render;
  const memoryInfo = renderer.info.memory;
  const map = scene.map;

  update(scene);

  return {
    renderStats: {
      FPS: {
        FPS: String(time.getFPS() + ' (' + minFPS + '/' + maxFPS + ')'),
        average: (((fpsCounter / tickCounter) * 100) | 0) / 100
      },
      framesRendered: scene.framesRendered,
      geometries: memoryInfo.geometries,
      textures: memoryInfo.textures,
      programs: memoryInfo.programs,
      drawCalls: renderInfo.calls,
      faces: renderInfo.faces,
      points: renderInfo.points,
      vertices: renderInfo.vertices
    },
    mapObjects: {
      '#groups': getAllGroups(map).length,
      '#nodes': getAllNodes(map).length
    }
  };
}

function update() {
  const fps = time.getFPS();
  minFPS = Math.min(fps, minFPS);
  maxFPS = Math.max(fps, maxFPS);

  tickCounter++;
  fpsCounter += fps;
}
