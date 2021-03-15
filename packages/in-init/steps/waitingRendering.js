/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';

import history from 'in-stores/navigation/history';
import App from 'in-waiting-for-deployment/App';

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('main')
);
