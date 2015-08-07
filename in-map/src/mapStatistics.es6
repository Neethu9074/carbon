'use strict';

import * as time from './timeCalculations';
import {getAllNodes, getAllGroups} from './mapStructureUtils';


let minFPS = 1000;
let maxFPS = 0;
let fpsCounter = 0;
let tickCounter = 0;
const timeRangeForAvarage = 5;
const fpsArray = [];
let fpsArrayIndex = 0;
let framesRenderedInSecond = 0;

export function getMapStatistics(scene) {
  const renderer = scene.renderer;
  const renderInfo = renderer.info.render;
  const memoryInfo = renderer.info.memory;
  const map = scene.map;

  update(scene);

  return {
    seconds: time.getBigBangTime() | 0,
    renderStats: {
      FPS: {
        'FPS possible': String(time.getFPS() + ' (' + minFPS + '/' + maxFPS + ')'),
        average: round(fpsArray.reduce((a, b) => a + b) / (timeRangeForAvarage + 1))
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

function update(scene) {
  const fps = time.getFPS();
  minFPS = Math.min(fps, minFPS);
  maxFPS = Math.max(fps, maxFPS);

  const fris = scene.framesRendered - framesRenderedInSecond;
  framesRenderedInSecond = scene.framesRendered;
  fpsArrayIndex = fpsArrayIndex >= timeRangeForAvarage ? 0 : fpsArrayIndex + 1;
  fpsArray[fpsArrayIndex] = fris;

  tickCounter++;
  fpsCounter += fps;
}

function round(t) {
  return ((t * 100) | 0) / 100;
}
