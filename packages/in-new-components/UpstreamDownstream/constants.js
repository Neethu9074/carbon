export const relationships = {
  UPSTREAM: 'UPSTREAM',
  DOWNSTREAM: 'DOWNSTREAM',
  SERVICE: 'SERVICE',
  APPLICATION: 'APPLICATION',
  SERVICE_ICON: 'lib_application_service',
  APPLICATION_ICON: 'lib_application',

  info: {
    UPSTREAM: {
      SERVICE: { text: 'Directly called by' },
      APPLICATION: { text: 'Directly called from within' },
      message: 'No Upstream',
      icon: 'lib_context_guide_upstream'
    },
    DOWNSTREAM: {
      SERVICE: { text: 'Directly calling' },
      APPLICATION: { text: 'Directly calling services within' },
      message: 'No downstream',
      icon: 'lib_context_guide_downstream'
    }
  }
};
