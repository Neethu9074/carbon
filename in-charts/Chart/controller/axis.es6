import invariant from 'invariant';

import createStackedAreaContentRenderer from 'in-charts/Chart/renderer/content/stackedArea';
import createLineContentRenderer from 'in-charts/Chart/renderer/content/stackedArea';
import createDataHolder from 'in-charts/data/dataHolder';
import createQueue from 'in-charts/data/queue';
import {timeframe$} from 'in-stores/timeline';
import createScale from 'in-charts/scale';


const contentRendererCreators = {
  stackedArea: createStackedAreaContentRenderer,
  line: createLineContentRenderer
};


export default function createAxisController(config) {
  const scales = config.scales = createScales();
  config.axisContentRenderers = createAxisContentRenderers();
  config.queues = createQueues();
  config.dataHolders = createDataHolders();

  subscribeToDataSources();

  return {
    resize,
    dispose
  };


  function dispose() {
    // TODO
  }


  function resize() {
    scales.x.setRangeFrom(config.bounds.left);
    scales.x.setRangeTo(config.bounds.right);

    scales.y1.setRangeFrom(config.bounds.top);
    scales.y1.setRangeTo(config.bounds.bottom);
    if (scales.y2) {
      scales.y2.setRangeFrom(config.bounds.top);
      scales.y2.setRangeTo(config.bounds.bottom);
    }
  }


  function createScales() {
    const result = {};

    result.x = createScale();
    result.y1 = createScale();

    if (config.y2) {
      result.y2 = createScale();
    }

    return result;
  }


  function createAxisContentRenderers() {
    const result = {};

    result.y1 = createContentRenderer('y1');
    if (config.y2) {
      result.y2 = createContentRenderer('y2');
    }

    return result;
  }


  function createContentRenderer(axisName) {
    const contentRendererCreator = contentRendererCreators[config[axisName].type];

    if (__DEV__) {
      invariant(contentRendererCreator, `Unknown content renderer ${config[axisName].type}`);
    }

    return contentRendererCreator(config, axisName);
  }


  function createQueues() {
    const result = {};

    result.y1 = createQueueForAxis('y1');
    if (config.y2) {
      result.y2 = createQueueForAxis('y2');
    }

    return result;
  }


  function createQueueForAxis(axisName) {
    return createQueue({
      numberOfSeries: getNumberOfDataSeries(axisName),
      requireExistenceInAllSeries: config.axisContentRenderers[axisName].requireExistenceInAllSeries
    });
  }


  function getNumberOfDataSeries(axisName) {
    return config[axisName].labels.length;
  }


  function createDataHolders() {
    const result = {};

    result.y1 = createDataHolder({
      numberOfSeries: getNumberOfDataSeries('y1')
    });
    if (config.y2) {
      result.y2 = createDataHolder({
        numberOfSeries: getNumberOfDataSeries('y2')
      });
    }

    return result;
  }


  function subscribeToDataSources() {
    config.subscriptions.push(timeframe$.flatMap(timeframe => {
      clearAllData();
      config.timeframe = timeframe;
    }));
  }


  function clearAllData() {
    config.queues.y1.clear();
    config.dataHolders.y1.clear();

    if (config.y2) {
      config.queues.y2.clear();
      config.dataHolders.y2.clear();
    }
  }
}
