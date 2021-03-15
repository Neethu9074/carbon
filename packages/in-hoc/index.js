/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// this file is necessary for a successful installation of the in-stores
// module. Also, we can provide module usage information through this
// module.
//
// We want developers to only use parts of in-hoc so that unused code
// can successfully be eliminated by Webpack and uglifyJS.

throw new Error(
  'You should never require the whole in-hoc module. ' +
    'Please import only parts of it via import ' +
    "'in-hoc/foobar'."
);
