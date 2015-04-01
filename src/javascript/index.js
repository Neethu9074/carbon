'use strict';

import {load} from './ui_prototype/resources';
import DataListenerManager from './instana_data/dataListenerManager';

import App from './ui_prototype/app';
import {setup} from './ui_prototype/testSetup';
import {createLogger, setActiveSeverity} from './log';

if (__DEV__) {
  setActiveSeverity('debug');
} else {
  setActiveSeverity('info');
}

const logger = createLogger('index.js');
const liveData = false;

//first load all resources
logger.info('Loading resources...');
load(() => { //on finished
  const canvas = document.getElementById('WebGL');

  logger.info('Initializing application');

  //start up the UI when all resources are loaded
  const uiApplication = new App(canvas);

  if(liveData) {
    //live data each 2000 ms
    const dataManager = new DataListenerManager(uiApplication, 1000);
    logger.info('get live data via', dataManager);
  } else {
      //test setup
      setup(uiApplication);
  }

  logger.info('Finished initialization');
});
