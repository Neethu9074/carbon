import {on} from 'reactive-observables';

import keyCodes from 'in-components/keyCodes';
import {getDeltaTime} from 'in-map/misc/time';


export default function createKeyboardController(controls) {

  const moveSpeed = 3;
  let strife = 0;
  let forward = 0;

  const keyDownSubscription = on(window, 'keydown').subscribe(e => onKey(e, -1, -1, 1, 1));
  const keyUpSubscription = on(window, 'keyup').subscribe(e => onKey(e, 0, 0, 0, 0));

  function onKey(event, w, a, s, d) {
    switch (event.keyCode) {
      case keyCodes.w:
        forward = w;
        break;
      case keyCodes.a:
        strife = a;
        break;
      case keyCodes.s:
        forward = s;
        break;
      case keyCodes.d:
        strife = d;
        break;
      default:
    }

  }

  function update() {
    const dt = getDeltaTime();

    controls.camTransformObject.translateX(strife * dt * moveSpeed);
    controls.camTransformObject.translateZ(forward * dt * moveSpeed);
  }

  return {
    update,
    dispose
  };

  function dispose() {
    keyDownSubscription.dispose();
    keyUpSubscription.dispose();
  }
}
