/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { each, map, values } from 'lodash';

import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { PARAMETER, toChunks } from 'in-services/util/stringToChunks';
import { t } from 'in-i18n';

const placeholderTypes = Object.freeze({
  application: 'application',
  service: 'service',
  endpoint: 'endpoint'
});

const applicationNamePlaceholder = Object.freeze({
  template: '${application.name}',
  name: t('in-alerting:smartAlerts.applications.advanced.applicationNamePlaceholder'),
  type: placeholderTypes.application
});

const serviceNamePlaceholder = Object.freeze({
  template: '${service.name}',
  name: t('in-alerting:smartAlerts.applications.advanced.serviceNamePlaceholder'),
  type: placeholderTypes.service
});

const endpointNamePlaceholder = Object.freeze({
  template: '${endpoint.name}',
  name: t('in-alerting:smartAlerts.applications.advanced.endpointNamePlaceholder'),
  type: placeholderTypes.endpoint
});

export const placeholdersByEvaluationType = Object.freeze({
  [PER_AP]: [applicationNamePlaceholder],
  [PER_AP_SERVICE]: [applicationNamePlaceholder, serviceNamePlaceholder],
  [PER_AP_ENDPOINT]: [applicationNamePlaceholder, serviceNamePlaceholder, endpointNamePlaceholder]
});

/**
 * Replaces the placeholders with respective markup.
 * @param {String} evaluationType The alert evaluation type to define the owning entity type.
 * @param {String} text           Text containing placeholders which should be enhanced with markup to highlight them.
 * @param {function} replacer     Function returning the value which respective placeholder should be replaced with
 * @returns {array} Containing the string enhanced with HTML elements and CSS styles
 */
export function replacePlaceholdersWithMarkup(evaluationType, text, replacer) {
  const placeholders = placeholdersByEvaluationType[evaluationType];
  let chunks = toChunks(text, map(placeholders, 'template'));

  each(map(values(placeholders)), ({ template, name }, i) => {
    each(chunks, chunk => {
      if (chunk.type === PARAMETER && chunk.value === template) {
        chunk.value = replacer({ template, name, i });
      }
    });
  });

  return map(chunks, 'value');
}
