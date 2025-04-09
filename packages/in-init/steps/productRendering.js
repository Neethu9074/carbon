/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint no-redeclare: ["off", { "builtinGlobals": true }] */

import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';

import history from 'in-stores/navigation/history';
import App from 'in-client/js/App';

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('main')
);

if (__HOT_RELOAD__ && module.hot) {
  module.hot.accept('in-client/js/App', () => {

    const NextApp = require('in-client/js/App').default;
    ReactDOM.render(
      <Router history={history}>
        <NextApp />
      </Router>,
      document.getElementById('main')
    );
  });
}
