'use strict';

import Scene from './Scene';

//logging
import logging from 'instalog';
//const logger = logging.createLogger('map.es6');


export function init(opts) {
  const uiApplication = new Scene(opts);
  //const dataManager = new DataListenerManager(uiApplication, 1000);

  return {
    dispose: () => uiApplication.dispose()
  };
}
