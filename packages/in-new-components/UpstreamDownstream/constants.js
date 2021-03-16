/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const relationships = {
  UPSTREAM: 'UPSTREAM',
  DOWNSTREAM: 'DOWNSTREAM',
  SERVICE: 'SERVICE',
  APPLICATION: 'APPLICATION',
  SERVICE_ICON: 'lib_application_service',
  APPLICATION_ICON: 'lib_application',

  info: {
    UPSTREAM: {
      SERVICE: { type: 'Service', text: t('in-new-components:upstreamDownstream.upstreamServiceText') },
      APPLICATION: { type: 'Application', text: t('in-new-components:upstreamDownstream.upstreamApplicationText') },
      message: t('in-new-components:upstreamDownstream.upstreamMessage'),
      icon: 'lib_context_guide_upstream'
    },
    DOWNSTREAM: {
      SERVICE: { type: 'Service', text: t('in-new-components:upstreamDownstream.downstreamServiceText') },
      APPLICATION: { type: 'Application', text: t('in-new-components:upstreamDownstream.downstreamApplicationText') },
      message: t('in-new-components:upstreamDownstream.downstreamMessage'),
      icon: 'lib_context_guide_downstream'
    }
  }
};
