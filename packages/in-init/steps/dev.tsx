/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { allStates } from 'in-stores/store';

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
}

window.instana.dev = window.instana.dev || {};
window.instana.dev.storeStates = allStates;
