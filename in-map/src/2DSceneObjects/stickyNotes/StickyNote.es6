import SceneObject from '../SceneObject';

import './StickyNote.less';


export default class StickyNote extends SceneObject {

  constructor(config) {
    super(config);

    this.mount();
  }

  update() {
    this.setScreenPosition(this.parent.screenPosition);
  }

  setInactive(inactive) {
    const sticky = this.container;

    if (inactive) {
      sticky.classList.remove('in-sticky-note__active');
      sticky.classList.add('in-sticky-note__inactive');
    } else {
      sticky.classList.remove('in-sticky-note__inactive');
      sticky.classList.add('in-sticky-note__active');
    }
  }
}
