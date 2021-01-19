/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import 'in-client/js/devtools/storeStates';

// expose the React global to analyze performance issues
if (__DEV__) {
  window.React = React;
}
