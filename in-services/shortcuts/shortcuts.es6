import {on} from 'reactive-observables';

import onEscapePressed from 'in-services/shortcuts/shortcuts/Esc';
import onFPressed from 'in-services/shortcuts/shortcuts/F';
import onVPressed from 'in-services/shortcuts/shortcuts/V';
import onCPressed from 'in-services/shortcuts/shortcuts/C';
import keyCodes from 'in-components/keyCodes';


const registeredShortcuts = {};

export function init() {
  registeredShortcuts[keyCodes.escape] = onEscapePressed;
  registeredShortcuts[keyCodes.f] = onFPressed;
  registeredShortcuts[keyCodes.v] = onVPressed;
  registeredShortcuts[keyCodes.c] = onCPressed;

  on(window, 'keydown').subscribe(keyEvent => {
    const targetType = keyEvent.target.tagName.toLowerCase();
    if (targetType === 'input' ||
        targetType === 'textarea' ||
        keyEvent.ctrlKey || keyEvent.altKey || keyEvent.metaKey) {
      return;
    }
    if (registeredShortcuts[keyEvent.keyCode]) {
      registeredShortcuts[keyEvent.keyCode](keyEvent);
    }
  });
}
