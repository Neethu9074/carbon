/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { track, MAP_SELECT_ENTITY } from 'in-services/tracking/tracking';

export const entitySelectedTracker = e => track(MAP_SELECT_ENTITY, e);
