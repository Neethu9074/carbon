import {getAllNodes, getAllGroups, getAllLayer} from './3DSceneObjects/physical/mapUtils';
import {lowState, midState, maxState} from './AdaptiveDetailHandler';
import * as time from './timeCalculations';

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
  const renderer = scene.webGLRenderer;
  const renderInfo = renderer.info.render;
  const memoryInfo = renderer.info.memory;
  const map = scene.mapHandler.map;

  update(scene);

  const allDetailSec = detailLevels.low + detailLevels.mid + detailLevels.max;
  window.instana.dev.mapStatistics = () => {
    const factories = {};
    Object.keys(map.factories || []).map(key => {
      const factory = map.factories[key];
      factories[key] = factory.numberUpdates | 0;
    });

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
        programs: renderer.info.programs,
        drawCalls: renderInfo.calls,
        faces: renderInfo.faces,
        points: renderInfo.points,
        vertices: renderInfo.vertices
      },
      mapObjects: {
        '#groups': getAllGroups(map).length,
        '#nodes': getAllNodes(map).length,
        '#layer': getAllLayer(map).length,
        factories,
        details: {
          low: String(((detailLevels.low / allDetailSec) * 100) | 0) + '%',
          mid: String(((detailLevels.mid / allDetailSec) * 100) | 0) + '%',
          max: String(((detailLevels.max / allDetailSec) * 100) | 0) + '%'
        }
      }
    };
  };

  return window.instana.dev.mapStatistics();
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
