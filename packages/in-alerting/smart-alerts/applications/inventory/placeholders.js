/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { each, map, values } from 'lodash';
import React from 'react';

import { PARAMETER, toChunks } from 'in-services/util/stringToChunks';
import theme from 'in-themes/theme';

export const placeholderTypes = Object.freeze({
  application: 'application',
  service: 'service',
  endpoint: 'endpoint'
});

export const placeholders = Object.freeze([
  { template: '${application.name}', name: 'Application', type: placeholderTypes.application },
  { template: '${service.name}', name: 'Service', type: placeholderTypes.service },
  { template: '${endpoint.name}', name: 'Endpoint', type: placeholderTypes.endpoint }
]);

export function removePlaceholderSpecificCharacters(placeholderValue) {
  return placeholderValue.replace(/[${}]/g, '');
}

export function highlightPlaceholderReplacer({ template, i }) {
  return [
    '${',
    <span key={`${i}`} style={{ color: theme.lib.colors.pink800 }}>
      {removePlaceholderSpecificCharacters(template)}
    </span>,
    '}'
  ];
}

/**
 *
 * @param {String} text, text containing plaeholders which should be enhanced with markup to highlight them.
 * @param {function} replacer, function returning the value which respective placeholder should be replaced with
 * @returns {array} containing the string enhanced with HTML elements and CSS styles
 */
export function replacePlaceholdersWithMarkup(text, replacer) {
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
