/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const relationships = {
  UPSTREAM: 'UPSTREAM',
  DOWNSTREAM: 'DOWNSTREAM',
  SERVICE: 'SERVICE',
  APPLICATION: 'APPLICATION',
  SERVICE_ICON: 'lib_application_service',
  APPLICATION_ICON: 'lib_application',

  info: {
    UPSTREAM: {
      SERVICE: { type: 'Service', text: 'Directly Called by' },
      APPLICATION: { type: 'Application', text: 'Directly Called from Within' },
      message: 'didn’t receive any calls',
      icon: 'lib_context_guide_upstream'
    },
    DOWNSTREAM: {
      SERVICE: { type: 'Service', text: 'Directly Calling' },
      APPLICATION: { type: 'Application', text: 'Directly Calling Services Within' },
      message: 'didn’t initiate any downstream calls',
      icon: 'lib_context_guide_downstream'
    }
  }
};
