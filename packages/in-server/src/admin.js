/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
const admin = require('admin');
const serverConfig = require('./serverConfig.js');

admin.configure({
  http: {
    bindAddress: '0.0.0.0',
    port: serverConfig.adminPort
  },

  plugins: [
    require('admin-plugin-index')(),
    require('admin-plugin-environment')(),
    require('admin-plugin-config')({
      config: serverConfig
    }),
    require('admin-plugin-healthcheck')({
      checks: {}
    })
  ]
});

admin.start();
