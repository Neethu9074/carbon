import {getAllNodes, getAllGroups} from './mapStructureUtils';
import * as time from './timeCalculations';
import {lowState, midState, maxState} from './AdaptiveDetailHandler';

let minFPS = 1000;
let maxFPS = 0;
let fpsCounter = 0;
let tickCounter = 0;
const timeRangeForAvarage = 5;
const fpsArray = [];
let fpsArrayIndex = 0;
let framesRenderedInSecond = 0;

const detailLevels = { low: 0, mid: 0, max: 0 };

export function getMapStatistics(scene) {
  const renderer = scene.renderer;
  const renderInfo = renderer.info.render;
  const memoryInfo = renderer.info.memory;
  const map = scene.map;

  update(scene);

  const allDetailSec = detailLevels.low + detailLevels.mid + detailLevels.max;
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
      '#nodes': getAllNodes(map).length,
      factories: {
        highlight: scene.highlightingSingleMeshFactory.numberUpdates | 0,
        metrics: scene.singleMeshMetricFactory.numberUpdates | 0,
        ground: scene.groundSingleMeshFactory.numberUpdates | 0,
        SMF_updates: scene.singleMeshFactory.numberUpdates | 0,
        layer: scene.layerSingleMeshFactory.numberUpdates | 0
      },
      details: {
        low: String(((detailLevels.low / allDetailSec) * 100) | 0) + '%',
        mid: String(((detailLevels.mid / allDetailSec) * 100) | 0) + '%',
        max: String(((detailLevels.max / allDetailSec) * 100) | 0) + '%'
      }
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

  //
  const adaptiveDetailHandler = scene.adaptiveDetailHandler;
  if (adaptiveDetailHandler.state === lowState) {
    detailLevels.low++;
  } else if (adaptiveDetailHandler.state === midState) {
    detailLevels.mid++;
  } else if (adaptiveDetailHandler.state === maxState) {
    detailLevels.max++;
  }
}

function round(t) {
  return ((t * 100) | 0) / 100;
}
