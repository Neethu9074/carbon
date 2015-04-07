'use strict';

import {load} from './javascript/ui_prototype/resources';
/*eslint-disable max-len */
import DataListenerManager from './javascript/instana_data/dataListenerManager';
/*eslint-enable max-len */
import App from './javascript/ui_prototype/app';
import {setup} from './javascript/ui_prototype/testSetup';
import logging from 'instalog';

const logger = logging.createLogger('map.js');
const liveData = false;


function init(DomElement){
  //first load all resources
  logger.info('Loading resources...');
  load(() => { //on finished
    logger.info('Initializing application');

    //start up the UI when all resources are loaded
    const uiApplication = new App(DomElement);

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
}

export default init;
