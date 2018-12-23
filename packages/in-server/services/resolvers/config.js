const serverConfig = require('../../serverConfig.js');

exports.getFeatureFlags = () => Promise.resolve(serverConfig.clientConfig.featureFlags);
exports.getConfiguration = () => Promise.resolve(serverConfig.clientConfig.configuration);
exports.getUiBackendBaseUrl = () => Promise.resolve(serverConfig.uiBackendBaseUrl);
