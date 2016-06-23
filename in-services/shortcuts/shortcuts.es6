import * as ro from 'reactive-observables';
import {remove} from 'lodash';

import {register as registerDashboardShortcuts} from 'in-services/shortcuts/shortcuts/dashboard';


export const KEY_CODES = {
  ESC: 27
};

let registeredShortcuts = {};

export function init() {
  ro.on(window, 'keydown').subscribe(event => fireShortcutListener(event.keyCode));

  registerDashboardShortcuts(registerShortcut, unregisterShortcut, KEY_CODES);
}

export function registerShortcut(keycode, callback) {
  if (!registeredShortcuts[keycode]) {
    registeredShortcuts[keycode] = [];
  }

  registeredShortcuts[keycode].push(callback);
}

export function unregisterShortcut(keycode, callback) {
  if (registeredShortcuts[keycode]) {
    remove(registeredShortcuts[keycode], fn => fn === callback);
  }
}

function fireShortcutListener(keycode) {
  if (registeredShortcuts[keycode]) {
    registeredShortcuts[keycode].forEach(callback => callback());
  }
}

// is used for testing purpose
export function clearRegristry() {
  registeredShortcuts = {};
}
