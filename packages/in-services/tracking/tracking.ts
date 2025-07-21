/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';
import { invert, isEqual, sortedUniq } from 'lodash';
import invariant from 'invariant';

import { createLogger } from '@instana/logger';
import { TimeConfig } from '@instana/types';

import { track as trackInternal } from 'in-services/tracking/trackers';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { VIEW_CHANGE } from 'in-services/tracking/eventNames';
import { navigationParameters$ } from 'in-stores/navigation';
import { onLastChance } from 'in-services/util/onLastChance';
import { Props as Title } from 'in-components/Title/Title';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { flattenObj } from 'in-services/util/object';
import { seconds } from 'in-services/time';

export * from 'in-services/tracking/eventNames';

const logger = createLogger('in-services/tracking');

interface State {
  location?: Location;
  timeConfig?: TimeConfig;
  titles: readonly Title[];
  meta: Object;
}

let pendingViewChangeTransmissionHandle: any = null;
let previousState: State;
let state: State = {
  location: undefined,
  titles: emptyArray,
  meta: emptyObject
};

export function track(event: string, payload?: Object) {
  if (!payload) {
    payload = emptyObject;
  }

  if (__DEV__) {
    invariant(isValidPayload(payload), 'The tracking payload must be an object (or undefined).');
  } else if (!isValidPayload(payload)) {
    logger.error('Tracking payload is not an object for event', event);
    payload = emptyObject;
  }

  payload = {
    ...getStateBasedMetaData(),
    ...payload
  };

  trackInternal(event, payload);
}

function isValidPayload(payload: Object) {
  return Object.getPrototypeOf(payload) === Object.prototype;
}

export function init() {
  navigationParameters$.subscribe(location => {
    transmitViewChange();
    state = {
      location,
      timeConfig: getTimeConfig(location),
      titles: state.titles,
      meta: state.meta
    };
    pendingViewChangeTransmissionHandle = setTimeout(transmitViewChange, seconds.toMillis(10));
  });

  onLastChance(transmitViewChange);
}

function transmitViewChange() {
  if (!state.location) {
    return;
  }

  if (pendingViewChangeTransmissionHandle) {
    clearTimeout(pendingViewChangeTransmissionHandle);
    pendingViewChangeTransmissionHandle = null;
  }

  const aggregatedMeta = getStateBasedMetaData();
  if (isBlank(aggregatedMeta.pageName)) {
    return;
  }

  if (!previousState || !isEqual(getStateEqualityFields(previousState), getStateEqualityFields(state))) {
    // Deliberately using trackInternal because we are potentially transmitting an event with
    // out of date meta data (which is by design). The non-internal track function would always
    // use the latest meta data.
    trackInternal(VIEW_CHANGE, aggregatedMeta);
  }

  previousState = state;
  previousState.location = undefined;
}

// Define which values should be compared in order to identify a view change.
// A deep comparison will be executed between two states to identify a state change.
function getStateEqualityFields(state: State) {
  return {
    meta: state.meta,
    titles: state.titles
  };
}

function getStateBasedMetaData() {
  let pageName = sortedUniq(state.titles.map(({ title }) => getStringInEnglish(title)).filter(isNotBlank)).join(' > ');
  return {
    pageName,
    pagePath: state.location?.pathname,
    windowSize: formatDurationAccurately(state.timeConfig?.windowSize),
    ...state.meta
  };
}

export function setTitles(titles: Title[]) {
  state.titles = titles;
}

export function setMeta(meta: Object) {
  state.meta = meta;
}

let flattenedLanguageData: Record<string, string>;
const getStringInEnglish = (string?: string) => {
  const currentLanguageData = i18n.getDataByLanguage(i18n.language);
  if (!string || !currentLanguageData) return;

  if (!flattenedLanguageData) {
    flattenedLanguageData = invert(flattenObj(currentLanguageData));
  }

  let englishString;
  const stringKey = flattenedLanguageData[string]?.split('.');

  if (!stringKey) return string;

  const ns = stringKey[0];
  const key = stringKey.slice(1).join('.');

  englishString = i18n.getResource('en-US', ns, key);

  return englishString;
};
