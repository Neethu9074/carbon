import {on} from 'reactive-observables';

import {isLogicalMapView$, goToPhysicalView, goToLogicalView} from 'in-stores/navigation/navigationWebVR';
import keyCodes from 'in-components/keyCodes';


export default function createKeyboardController(controls) {
  let strife = 0;
  let forward = 0;

  const keyDownSubscription = on(window, 'keydown').subscribe(e => {
    onKey(e, 1, -1, -1, 1);

    if (e.keyCode === keyCodes.p) {
      controls.toggleMetrics();
    } else if (e.keyCode === keyCodes.n) {
      // toggle physical and logical view
      isLogicalMapView$.once(isLogicalMapView => isLogicalMapView ? goToPhysicalView() : goToLogicalView());
    }
  });
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
    controls.move(forward, strife);
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
