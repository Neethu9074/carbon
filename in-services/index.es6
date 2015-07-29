'use strict';

// this file is necessary for a successful installation of the in-services
// module. Also, we can provide module usage information through this
// module.
//
// We want developers to only use parts of in-services so that unused code
// can successfully be eliminated by Webpack and uglifyJS.

throw new Error('You should never require the whole in-services module. ' +
  'Please import only parts of it via import ' +
  '\'in-services/converters\'.');
