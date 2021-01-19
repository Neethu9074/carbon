/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const boundaryScopes = {
  default: 'INBOUND',
  inbound: 'INBOUND',
  all: 'ALL',

  info: {
    INBOUND: {
      text: 'Inbound Calls',
      icon: 'lib_application_boundary_inbound_calls',
      dashboard:
        'The dashboard is displaying information based only on the calls that are performed by the consumers of this application.',
      overrideDefault:
        'The default scope for this application is Inbound Calls only. You can change this in Configuration.'
    },
    ALL: {
      text: 'All Calls',
      icon: 'lib_application_boundary_all_calls',
      dashboard:
        'The dashboard is displaying information based on all calls that are performed within this application, by both consumers as well as internally.',
      overrideDefault: 'The default scope for this application is All Calls. You can change this in Configuration.'
    }
  }
};

export const switchScope = boundaryScope => {
  return boundaryScope === boundaryScopes.all ? boundaryScopes.inbound : boundaryScopes.all;
};
