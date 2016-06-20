import SceneObject from '../SceneObject';

import './StickyNote.less';


export default class StickyNote extends SceneObject {

  constructor(config) {
    super(config);

    this.mount();
  }

  update(screenPosition) {
    this.setScreenPosition(screenPosition);
  }

  setInactive(inactive) {
    const sticky = this.container;
    const baseClass = 'in-sticky-note';
    const active = baseClass + '__active';
    const inActive = baseClass + '__inactive';

    if (inactive) {
      sticky.classList.remove(active);
      sticky.classList.add(inActive);
    } else {
      sticky.classList.remove(inActive);
      sticky.classList.add(active);
    }
  }
}
