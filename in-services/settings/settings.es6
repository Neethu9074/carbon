import {create} from 'reactive-observables';
import Immutable from 'immutable';

import {emptyMap} from 'in-services/fixedImmutables';


const settingsPath = 'in-settings';
export const settingsStore = create({emitLatestOnSubscribe: true});
export const settings$ = settingsStore;

let settings = getFromStorage();

// load defaults if the storage emits null
if (!settings) {
  settings = emptyMap;
}

loadDefault();

settingsStore.emit(settings);

function loadDefault() {
  const aa = settings.getIn(['map', 'antialias']);
  if (aa === true) {
    setIn(['map', 'antialias'], 'browserAA');
  } else if (aa === false) {
    setIn(['map', 'antialias'], 'off');
  }

  setDefaultConfigValue(['map', 'scrollSpeed'], 1);
  setDefaultConfigValue(['map', 'packingXSpace'], 2);
  setDefaultConfigValue(['map', 'packingYSpace'], 6);
  setDefaultConfigValue(['map', 'scrollDirection'], 1);
  setDefaultConfigValue(['map', 'antialias'], 'browserAA');
  setDefaultConfigValue(['map', 'excludeUnmonitoredHosts'], false);
  setDefaultConfigValue(['map', 'logical', 'layouter'], 'flow'); // [flow, fruchtermann]
  setDefaultConfigValue(['map', 'physical', 'layouter'], 'simple'); // [simple, packed]
  setDefaultConfigValue(['map', 'logical', 'numServiceHops'], 1); // 0 or 1
  setDefaultConfigValue(['experiments'], false);
  setDefaultConfigValue(['autoCollapseTimeline'], false);
  setDefaultConfigValue(['showMaintenanceNotes'], true);
  setDefaultConfigValue(['zoomPanelIsActive'], true);
  setDefaultConfigValue(['charts', 'adaptToDevicePixelRatio'], true);
  setDefaultConfigValue(['formatTimestampsAsUtc'], false);

  setIn(['dataSource'], 'defaults');
}

function setDefaultConfigValue(path, defaultValue) {
  if (settings.getIn(path) === undefined) {
    setIn(path, defaultValue);
  }
}

export function setIn(path, value) {
  settings = settings.setIn(path, value);
  settingsStore.emit(settings);
  setToStorage();
}

export function toggleIn(path) {
  settings = settings.setIn(path, !settings.getIn(path, false));
  settingsStore.emit(settings);
  setToStorage();
}

export function getIn(path, defaultValue) {
  return settingsStore.map(set => {
    return set.getIn(path, defaultValue);
  }).distinct();
}

function setToStorage() {
  if (typeof(Storage) !== 'undefined') {
    localStorage.setItem(settingsPath, JSON.stringify(settings.toJS()));
  }
}

function getFromStorage() {
  if (typeof(localStorage) === 'undefined') {
    return null;
  }
  const temp = localStorage.getItem(settingsPath);
  if (!temp) {
    return null;
  }
  const fromStorage = Immutable.fromJS(JSON.parse(temp));
  fromStorage.setIn(['dataSource'], 'local storage');
  return fromStorage;
}
