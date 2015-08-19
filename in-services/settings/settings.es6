import Immutable from 'immutable';
import * as ro from 'reactive-observables';

const settingsPath = 'in-settings';
export const settingsStore = ro.create({emitLatestOnSubscribe: true});

let settings = getFromStorage();

//load defaults if the storage emits null
if (!settings) {
  settings = new Immutable.Map();
  loadDefault();
}

settingsStore.emit(settings);

function loadDefault() {
  setIn(['map', 'scrollSpeed'], 1);
  setIn(['map', 'scrollDirection'], 1);
  setIn(['dataSource'], 'defaults');
}

export function setIn(path, value) {
  settings = settings.setIn(path, value);
  settingsStore.emit(settings);

  setToStorage();
}

function setToStorage() {
  if(typeof(Storage) !== 'undefined') {
    localStorage.setItem(settingsPath, JSON.stringify(settings.toJS()));
  }
}

function getFromStorage() {
  if(typeof(Storage) === 'undefined') {
    return null;
  }
  const temp = localStorage.getItem(settingsPath);
  if(!temp) {
    return null;
  }
  const fromStorage = Immutable.fromJS(JSON.parse(temp));
  fromStorage.setIn(['dataSource'], 'local storage');
  return fromStorage;
}
