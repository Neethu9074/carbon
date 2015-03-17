'use strict';

//import instana from './instana_UI_3D/app';
//import setup from './instana_UI_3D/setup';
import {load} from './ui_prototype/resources';
import DataListenerManager from './instana_data/dataListenerManager';

import app from './ui_prototype/app';
import {setup} from './ui_prototype/testSetup';

//first load all resources
load(() => { //on finished

  //start up the UI when all resources are loaded
  const uiApplication = new app();
  //setup(uiApplication);

  //test setup
  //setup(uiApplication); return;

  const dataManager = new DataListenerManager(uiApplication, 2000);
});
