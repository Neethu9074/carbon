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
      SERVICE: { type: 'Service', text: 'in-components:upstreamDownstream.upstreamText' },
      APPLICATION: { type: 'Application', text: 'in-components:upstreamDownstream.upstreamText' },
      message: 'in-components:upstreamDownstream.upstreamMessage',
      icon: 'lib_context_guide_upstream'
    },
    DOWNSTREAM: {
      SERVICE: { type: 'Service', text: 'in-components:upstreamDownstream.downstreamText' },
      APPLICATION: { type: 'Application', text: 'in-components:upstreamDownstream.downstreamText' },
      message: 'in-components:upstreamDownstream.downstreamMessage',
      icon: 'lib_context_guide_downstream'
    }
  }
};
