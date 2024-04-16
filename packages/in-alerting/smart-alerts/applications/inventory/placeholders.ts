/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { t } from 'in-i18n';

const applicationNamePlaceholder = Object.freeze({
  template: '${application.name}',
  name: t('in-alerting:smartAlerts.applications.advanced.applicationNamePlaceholder')
});

const serviceNamePlaceholder = Object.freeze({
  template: '${service.name}',
  name: t('in-alerting:smartAlerts.applications.advanced.serviceNamePlaceholder')
});

const endpointNamePlaceholder = Object.freeze({
  template: '${endpoint.name}',
  name: t('in-alerting:smartAlerts.applications.advanced.endpointNamePlaceholder')
});

export const placeholdersByEvaluationType = Object.freeze({
  [PER_AP]: [applicationNamePlaceholder],
  [PER_AP_SERVICE]: [applicationNamePlaceholder, serviceNamePlaceholder],
  [PER_AP_ENDPOINT]: [applicationNamePlaceholder, serviceNamePlaceholder, endpointNamePlaceholder]
});
