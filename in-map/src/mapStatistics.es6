'use strict';

import * as time from './timeCalculations';


export function getMapStatistics(scene) {
  const renderer = scene.renderer;
  const renderInfo = renderer.info.render;
  const memoryInfo = renderer.info.memory;

  return {
    renderStats: {
      fps: time.getFPS(),
      geometries: memoryInfo.geometries,
      textures: memoryInfo.textures,
      programs: memoryInfo.programs,
      drawCalls: renderInfo.calls,
      faces: renderInfo.faces,
      points: renderInfo.points,
      vertices: renderInfo.vertices
    },
    objects: {
      groups: scene.map.groups.length
    }
  };
}
