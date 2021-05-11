/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest,node */
/* eslint-disable no-var, vars-on-top, strict */

'use strict';

module.exports = async () => {
  // Set our default time zone so that tests with date formatting are predictable.
  global.process.env.TZ = 'Europe/Berlin';
};
