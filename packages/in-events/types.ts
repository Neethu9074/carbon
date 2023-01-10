/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Map } from 'immutable';

import { Event } from 'in-types';

/**
 * Type that is currently used in many components of in-events using immutableJS Map for an event.
 * In the long-term, we would like to get rid of the use of immutableJS, which should then also make this type unnecessary.
 */
export type EventMap = Map<string, unknown>;

/**
 * Type that is currently used in many components of in-events, which can be either of an immutableJS Map, or a JSON event.
 * In the long-term, we would like to get rid of the use of immutableJS, which should then also make this combined type
 * unnecessary.
 */
export type EventOrMap = Event & EventMap;
