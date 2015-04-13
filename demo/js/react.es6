'use strict';

import React from 'react';
import logging from 'instalog';
import Map from '../../src';


export default function init() {
  const consoleAppender = new logging.ConsoleAppender();
  logging.addAppender(consoleAppender);

  let liveData = false;
  if(window.location.search === '?livedata') {
    liveData = true;
  }

  React.render(
    <Map liveData={liveData} onClick={onClick}/>,
    document.getElementById('map')
  );

  function onClick () {
  }
}
