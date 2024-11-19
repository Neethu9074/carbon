/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ApplicationBoundaryScope } from 'in-types';
import { minutes } from 'in-services/time/time';
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
} as const;

export const switchScope = (boundaryScope: ApplicationBoundaryScope): ApplicationBoundaryScope => {
  return boundaryScope === boundaryScopes.all ? boundaryScopes.inbound : boundaryScopes.all;
};

export const minEvaluationGranularity = minutes.toSeconds(1);
export const defaultEvaluationGranularity = minutes.toSeconds(5);
export const maxEvaluationGranularity = minutes.toSeconds(15);
