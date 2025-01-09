/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { eventsPath } from 'in-events/navigation/paths';
import { eventId } from 'in-events/navigation/matrix';

export const eventIdUrlParameter = {
  path: eventsPath,
  name: eventId
};

export const orderDirectionParameter = {
  path: eventsPath,
  name: 'orderDirection',
  initialState: 'DESC'
};

export const filterParameter = {
  path: eventsPath,
  name: 'filter',
  initialState: ''
}

export const orderByUrlParameter = {
  path: eventsPath,
  name: 'orderBy',
  initialState: 'start'
};

export const pageNumberUrlParameter = {
  path: eventsPath,
  name: 'relatedEventsPage',
  initialState: 1,
  parser: intParser
};
