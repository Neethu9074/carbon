const admin = require('admin');
const serverConfig = require('./serverConfig.js');
const clientConfig = require('./assets/config.json');
const uiBackend = require('./healthcheck/uiBackend');

admin.configure({
  http: {
    bindAddress: '127.0.0.1',
    port: serverConfig.adminPort
  },

  plugins: [
    require('admin-plugin-index')(),
    require('admin-plugin-report')(),
    require('admin-plugin-environment')(),
    require('admin-plugin-terminate')(),
    require('admin-plugin-config')({
      config: {
        serverConfig,
        clientConfig
      }
    }),
    require('admin-plugin-healthcheck')({
      checks: {
        uiBackend
      }
    })
  ]
});

admin.start();
