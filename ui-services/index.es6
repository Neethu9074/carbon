'use strict';

// this file is necessary for a successful installation of the ui-services
// module. Also, we can provide module usage information through this
// module.
//
// We want developers to only use parts of ui-services so that unused code
// can successfully be eliminated by Webpack and uglifyJS.

throw new Error('You should never require the whole ui-services module. ' +
  'Please import only parts of it via import ' +
  '\'instana-ui-services/converters\'.');
