import {focusCurrentlyHighlightedEntity} from 'in-map/src/stores/focusEntity';


export function register(registerShortcut, unregisterShortcut, keyCodes) {
  registerShortcut(keyCodes.C, focusCurrentlyHighlightedEntity);
}
