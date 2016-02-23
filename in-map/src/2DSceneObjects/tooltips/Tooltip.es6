import {cursorPosition} from 'in-map/src/stores';

import SceneObject from '../SceneObject';

import './Tooltip.less';


export default class Tooltip extends SceneObject {
  constructor({parent, cssClass = 'in-tooltip'}) {
    super({parent, cssClass});
  }

  mount() {
    super.mount();

    this.moveSubscribtion = cursorPosition.subscribe(xy => this.setScreenPosition(xy));
    this.render();
  }

  unMount() {
    if (this.moveSubscribtion) {
      this.moveSubscribtion.dispose();
      this.moveSubscribtion = null;
    }

    super.unMount();
  }
}
