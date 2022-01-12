/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import { t } from 'in-i18n';

export const boundaryScopes = {
  inbound: 'INBOUND',
  all: 'ALL',

  info: {
    INBOUND: {
      text: t('in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.config.inbound.text'),
      icon: 'lib_application_boundary_inbound_calls',
      dashboard: t('in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.config.inbound.dashboard'),
      overrideDefault: t(
        'in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.config.inbound.overrideDefault'
      )
    },
    ALL: {
      text: t('in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.config.all.text'),
      icon: 'lib_application_boundary_all_calls',
      dashboard: t('in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.config.all.dashboard'),
      overrideDefault: t(
        'in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.config.all.overrideDefault'
      )
    }
  }
};

export const boundaryScopePropType = PropTypes.oneOf(['ALL', 'INBOUND']);
