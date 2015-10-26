import Immutable from 'immutable';
import * as ro from 'reactive-observables';

const settingsPath = 'in-settings';
export const settingsStore = ro.create({emitLatestOnSubscribe: true});

let settings = getFromStorage();

//load defaults if the storage emits null
if (!settings) {
  settings = new Immutable.Map();
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
  setDefaultConfigValue(['map', 'scrollDirection'], 1);
  setDefaultConfigValue(['map', 'antialias'], 'browserAA');
  setDefaultConfigValue(['desktopNotification'], false);

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
  if (typeof(Storage) === 'undefined') {
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
