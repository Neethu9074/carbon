'use strict';

//import instana from './instana_UI_3D/app';
//import setup from './instana_UI_3D/setup';
import {load} from './ui_prototype/resources';
import DataListenerManager from './instana_data/dataListenerManager';

import app from './ui_prototype/app';
import {setup} from './ui_prototype/testSetup';
import {createLogger, setActiveSeverity} from './log';

if (__DEV__) {
  setActiveSeverity('debug');
} else {
  setActiveSeverity('info');
}

const logger = createLogger('index.js');

//first load all resources
logger.info('Loading resources...');
load(() => { //on finished

  logger.info('Initializing application');

  //start up the UI when all resources are loaded
  const uiApplication = new app();

  //test setup
  //setup(uiApplication); return;

  //live data
  const dataManager = new DataListenerManager(uiApplication, 2000);

  logger.info('Finished initialization');
});
