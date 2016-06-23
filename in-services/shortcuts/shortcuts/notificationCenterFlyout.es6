import {toggleMenu} from 'in-components/notificationCenter/Flyout/stores/visibilityStore';


export function register(registerShortcut, unregisterShortcut, keyCodes) {
  registerShortcut(keyCodes.N, toggleMenu);
}
