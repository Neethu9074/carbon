/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const boundaryScopes = {
  default: 'INBOUND',
  inbound: 'INBOUND',
  all: 'ALL',

  info: {
    INBOUND: {
      text: t('in-applications:inboundOutboundCalls.config.inbound.text'),
      icon: 'lib_application_boundary_inbound_calls',
      dashboard: t('in-applications:inboundOutboundCalls.constants.inboundDashboard'),
      overrideDefault: t('in-applications:inboundOutboundCalls.constants.inboundOverrideDefault')
    },
    ALL: {
      text: t('in-applications:inboundOutboundCalls.config.all.text'),
      icon: 'lib_application_boundary_all_calls',
      dashboard: t('in-applications:inboundOutboundCalls.constants.allDashboard'),
      overrideDefault: t('in-applications:inboundOutboundCalls.constants.allOverrideDefault')
    }
  }
};

export const switchScope = boundaryScope => {
  return boundaryScope === boundaryScopes.all ? boundaryScopes.inbound : boundaryScopes.all;
};

export const syntheticCallsOptions = {
  default: 'EXCLUDE',
  exclude: 'EXCLUDE',
  include: 'INCLUDE',
  only: 'ONLY',

  info: {
    EXCLUDE: {
      label: 'Exclude',
      description: 'Synthetic calls are excluded from the metrics.'
    },
    INCLUDE: {
      label: 'Include',
      description: 'Synthetic calls are included in the metrics.'
    },
    ONLY: {
      label: 'Only',
      description: 'Only synthetic calls are shown and included in the metrics'
    }
  }
};
